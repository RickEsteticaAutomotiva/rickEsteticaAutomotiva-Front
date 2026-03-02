import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { DropdownButton } from '../../../../components/gerente/dropdown-button/DropdownButton';
import { useToast } from '../../../../context/ToastContext';
import { TiposToast } from '../../../../utils/enum/TiposToast';

export function ModalFiltro({ 
    isOpen, 
    onClose, 
    onAplicarFiltros
}) {
    const { mostrarToast } = useToast();
    
    const [filtros, setFiltros] = useState({
        categoria: '',
        status: '',
        servico: '',
        dataAgendamento: '',
        dataConclusao: ''
    });

    const [categoriaDropdownAberto, setCategoriaDropdownAberto] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState({ id: 3, valor: 'Detalhamento' });

    const [statusDropdownAberto, setStatusDropdownAberto] = useState(false);
    const [statusSelecionado, setStatusSelecionado] = useState({ id: 3, valor: 'Concluído' });

    const [servicoDropdownAberto, setServicoDropdownAberto] = useState(false);
    const [servicoSelecionado, setServicoSelecionado] = useState({ id: 3, valor: 'Polimento' });

    const dateInicioRef = useRef(null);
    const dateFimRef = useRef(null);

    const categorias = [
        { id: 1, valor: 'Lavagem' },
        { id: 2, valor: 'Polimento' },
        { id: 3, valor: 'Detalhamento' }
    ];

    const statusOptions = [
        { id: 1, valor: 'Agendado' },
        { id: 2, valor: 'Em Andamento' },
        { id: 3, valor: 'Concluído' },
        { id: 4, valor: 'Cancelado' }
    ];

    const servicoOptions = [
        { id: 1, valor: 'Lavagem Simples' },
        { id: 2, valor: 'Lavagem Completa' },
        { id: 3, valor: 'Polimento' },
        { id: 4, valor: 'Enceramento' }
    ];

    useEffect(() => {
        setFiltros(prev => ({...prev, categoria: categoriaSelecionada.id}));
    }, [categoriaSelecionada]);

    useEffect(() => {
        setFiltros(prev => ({...prev, status: statusSelecionado.id}));
    }, [statusSelecionado]);

    useEffect(() => {
        setFiltros(prev => ({...prev, servico: servicoSelecionado.id}));
    }, [servicoSelecionado]);

    const limparFiltros = () => {
        setFiltros({
            categoria: '',
            status: '',
            servico: '',
            dataAgendamento: '',
            dataConclusao: ''
        });
        setCategoriaSelecionada({ id: null, valor: '' });
        setStatusSelecionado({ id: null, valor: '' });
        setServicoSelecionado({ id: null, valor: '' });
    };

    const aplicarFiltros = () => {
        if (filtros.dataAgendamento && filtros.dataConclusao) {
            const dataInicio = new Date(filtros.dataAgendamento);
            const dataFim = new Date(filtros.dataConclusao);
 
            if (dataFim < dataInicio) {
                mostrarToast({
                    tipo: TiposToast.ALERTA,
                    titulo: 'Data Inválida',
                    mensagem: 'A data de fim não pode ser menor que a data de início',
                    duracao: 4000
                });
                return;
            }
        }
        
        onAplicarFiltros(filtros);
        onClose();
    };

    const contarFiltrosAtivos = () => {
        return Object.values(filtros).filter(valor => valor !== '').length;
    };

    useEffect(() => {
        const handlePopState = (event) => {
            if (isOpen) {
                event.preventDefault();
                onClose();
                window.history.pushState(null, '', window.location.href);
            }
        };

        if (isOpen) {
            window.history.pushState(null, '', window.location.href);
            window.addEventListener('popstate', handlePopState);
        }

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/45 bg-opacity-90 z-50"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="fixed bottom-0 left-2 right-2 bg-white rounded-t-3xl z-50 h-3/4 flex flex-col animate-slide-up">
                {/* Header */}
                <div className="relative flex items-center p-6 border-b border-gray-100">
                    <button 
                        onClick={limparFiltros}
                        className="text-red-600 font-medium"
                    >
                        Limpar
                    </button>
                    <h2 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-gray-900">
                        Filtro
                    </h2>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Categoria */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-900">Categoria</label>
                            <div className="relative">
                                <DropdownButton
                                    valorSelecionado={categoriaSelecionada}
                                    setValorSelecionado={setCategoriaSelecionada}
                                    dropdownAberto={categoriaDropdownAberto}
                                    setDropdownAberto={setCategoriaDropdownAberto}
                                    valores={categorias}    
                                    comSelecionar={true}            
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-900">Status</label>
                            <div className="relative">
                                <DropdownButton
                                    valorSelecionado={statusSelecionado}
                                    setValorSelecionado={setStatusSelecionado}
                                    dropdownAberto={statusDropdownAberto}
                                    setDropdownAberto={setStatusDropdownAberto}
                                    valores={statusOptions}      
                                    comSelecionar={true}            
                                />
                            </div>
                        </div>
                    </div>

                    {/* Serviço */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-900">Serviço</label>
                            <div className="relative">
                                <DropdownButton
                                    valorSelecionado={servicoSelecionado}
                                    setValorSelecionado={setServicoSelecionado}
                                    dropdownAberto={servicoDropdownAberto}
                                    setDropdownAberto={setServicoDropdownAberto}
                                    valores={servicoOptions}     
                                    comSelecionar={true}             
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data do agendamento */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Data de Início
                        </label>
                        <div 
                            className="relative cursor-pointer"
                            onClick={() => dateInicioRef.current?.showPicker()}
                        >
                            <input 
                                ref={dateInicioRef}
                                type="date"
                                value={filtros.dataAgendamento}
                                max={filtros.dataConclusao || undefined}
                                onChange={(e) => setFiltros(prev => ({...prev, dataAgendamento: e.target.value}))}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-4 pr-10 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer"
                            />
                            <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Data de conclusão */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Data de Fim
                        </label>
                        <div 
                            className="relative cursor-pointer"
                            onClick={() => dateFimRef.current?.showPicker()}
                        >
                            <input 
                                ref={dateFimRef}
                                type="date"
                                value={filtros.dataConclusao}
                                min={filtros.dataAgendamento || undefined}
                                onChange={(e) => setFiltros(prev => ({...prev, dataConclusao: e.target.value}))}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-4 pr-10 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent cursor-pointer"
                            />
                            <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Footer Button */}
                <div className="p-6 border-t border-gray-100">
                    <button 
                        onClick={aplicarFiltros}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                        Aplicar ({contarFiltrosAtivos()})
                    </button>
                </div>
            </div>
        </>
    );
}