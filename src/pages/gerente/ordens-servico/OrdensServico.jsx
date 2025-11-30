import { ChevronDown, Search, Plus, Calendar, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { OrdemServicoItem } from './ordem-servico-item/OrdemServicoItem';
import { ModalOrdemServico } from '../agendamento/modal-ordem-servico/ModalOrdemServico';

export function OrdensServico() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState('Mês');
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [modalFiltroAberto, setModalFiltroAberto] = useState(false);
    const [modalAbertoOrdem, setModalAbertoOrdem] = useState(false);
    const [ordemSelecionada, setOrdemSelecionada] = useState([]);
    
    const periodos = ['Dia', 'Semana', 'Mês', 'Ano'];
    
    // Estados dos filtros
    const [filtros, setFiltros] = useState({
        categoria: '',
        status: '',
        servico: '',
        dataAgendamento: '',
        dataConclusao: ''
    });

    const abrirModal = (ordem) => {
        console.log('Item clicado:', ordem);
        setOrdemSelecionada(ordem);
        setModalAbertoOrdem(true);
    };

    const fecharModal = () => {
        setModalAbertoOrdem(false);
        setOrdemSelecionada([]);
    };

    const limparFiltros = () => {
        setFiltros({
            categoria: '',
            status: '',
            servico: '',
            dataAgendamento: '',
            dataConclusao: ''
        });
    };

    const aplicarFiltros = () => {
        // Lógica para aplicar filtros
        console.log('Filtros aplicados:', filtros);
        setModalFiltroAberto(false);
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

    // Hook para escutar o evento de voltar do navegador/celular
    useEffect(() => {
        const handlePopState = (event) => {
            if (modalFiltroAberto) {
                event.preventDefault();
                setModalFiltroAberto(false);
                // Adiciona um novo estado no histórico para manter a página atual
                window.history.pushState(null, '', window.location.href);
            }
        };

        if (modalFiltroAberto) {
            // Adiciona um estado no histórico quando o modal abre
            window.history.pushState(null, '', window.location.href);
            // Escuta o evento popstate
            window.addEventListener('popstate', handlePopState);
        }

        return () => {
            // Remove o listener quando o componente desmonta ou modal fecha
            window.removeEventListener('popstate', handlePopState);
        };
    }, [modalFiltroAberto]);

    return (
        <div className="mt-4">
            
            <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-2 ps-4">
                <span className="text-sm font-medium">Período</span>
                <div className="relative">
                    <button
                        onClick={() => setDropdownAberto(!dropdownAberto)}
                        className="bg-white text-gray-700 focus:rounded-lg text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 px-3 py-2  min-w-[100px]   transition-colors flex items-center justify-between"
                    >
                        <span>{periodoSelecionado}</span>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${dropdownAberto ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {dropdownAberto && (
                        <>
                            {/* Overlay para fechar dropdown ao clicar fora */}
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setDropdownAberto(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-20">
                                {periodos.map((periodo, index) => (
                                    <button
                                        key={periodo}
                                        onClick={() => {
                                            setPeriodoSelecionado(periodo);
                                            setDropdownAberto(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                            periodo === periodoSelecionado ? 'bg-red-50 text-red-600' : 'text-gray-700'
                                        } ${index === 0 ? 'rounded-t-lg' : ''} ${
                                            index === periodos.length - 1 ? 'rounded-b-lg' : ''
                                        }`}
                                    >
                                        {periodo}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-4 cursor-pointer"
             onClick={() => setModalFiltroAberto(true)}>
                <span className="text-sm">Filtros (3)</span>
                
                <button 
                   
                >
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

            {/* Modal de Filtro - Meia Tela Inferior */}
            {modalFiltroAberto && (
                <>
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0 bg-black/45 bg-opacity-90 z-50"
                        onClick={() => setModalFiltroAberto(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="fixed bottom-0 left-2 right-2 bg-white rounded-t-3xl z-50 h-3/4 flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={limparFiltros}
                                    className="text-red-600 font-medium"
                                >
                                    Limpar
                                </button>
                                <h2 className="text-lg font-semibold text-gray-900">Filtro</h2>
                            </div>
                        </div>

                        {/* Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Categoria */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-900">Categoria</label>
                                    <span className="text-sm text-gray-400">Detalhamento</span>
                                </div>
                                <div className="relative">
                                    <select 
                                        value={filtros.categoria}
                                        onChange={(e) => setFiltros(prev => ({...prev, categoria: e.target.value}))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="detalhamento">Detalhamento</option>
                                        <option value="lavagem">Lavagem</option>
                                        <option value="enceramento">Enceramento</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-900">Status</label>
                                    <span className="text-sm text-gray-400">Concluído</span>
                                </div>
                                <div className="relative">
                                    <select 
                                        value={filtros.status}
                                        onChange={(e) => setFiltros(prev => ({...prev, status: e.target.value}))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="agendado">Agendado</option>
                                        <option value="em-andamento">Em Andamento</option>
                                        <option value="concluido">Concluído</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Serviço */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-900">Serviço</label>
                                    <span className="text-sm text-gray-400">Polimento</span>
                                </div>
                                <div className="relative">
                                    <select 
                                        value={filtros.servico}
                                        onChange={(e) => setFiltros(prev => ({...prev, servico: e.target.value}))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="lavagem-simples">Lavagem Simples</option>
                                        <option value="lavagem-completa">Lavagem Completa</option>
                                        <option value="polimento">Polimento</option>
                                        <option value="enceramento">Enceramento</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Data do agendamento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Data do agendamento</label>
                                <div className="relative">
                                    <input 
                                        type="date"
                                        value={filtros.dataAgendamento}
                                        onChange={(e) => setFiltros(prev => ({...prev, dataAgendamento: e.target.value}))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="10-07-2025"
                                    />
                                    <Calendar size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Data de conclusão */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Data de conclusão</label>
                                <div className="relative">
                                    <input 
                                        type="date"
                                        value={filtros.dataConclusao}
                                        onChange={(e) => setFiltros(prev => ({...prev, dataConclusao: e.target.value}))}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Selecione"
                                    />
                                    <Calendar size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Footer Button */}
                        <div className="p-6 border-t border-gray-100">
                            <button 
                                onClick={aplicarFiltros}
                                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Aplicar (3)
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}