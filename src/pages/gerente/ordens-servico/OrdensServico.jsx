import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { OrdemServicoItem } from './ordem-servico-item/OrdemServicoItem';
import { ModalOrdemServico } from '../agendamento/modal-ordem-servico/ModalOrdemServico';
import { DropdownButton } from '../../../components/gerente/dropdown-button/DropdownButton';
import { ModalFiltro } from './modal-filtro/ModalFiltro';
import { ordemServicoService } from '../../../services/OrdemServicoService';
import { useToast } from '../../../context/ToastContext';
import { TiposToast } from '../../../utils/enum/TiposToast';
import { formatarHorario, formatarPreco } from '../../../utils';



export function OrdensServico() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState({ id: 3, valor: 'Mês' });
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [modalFiltroAberto, setModalFiltroAberto] = useState(false);
    const [modalAbertoOrdem, setModalAbertoOrdem] = useState(false);
    const [ordemSelecionada, setOrdemSelecionada] = useState(null);
    const [filtrosAplicados, setFiltrosAplicados] = useState({});
    const [ordensServico, setOrdensServico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingDetalhe, setLoadingDetalhe] = useState(false);
    const { mostrarToast } = useToast();
    
    const periodos = [
        { id: 1, valor: 'Dia' },
        { id: 2, valor: 'Semana' },
        { id: 3, valor: 'Mês' },
        { id: 4, valor: 'Ano' }
    ];
    
    const formatarVeiculo = (veiculo) => {
        if (!veiculo) return '-';
        if (typeof veiculo === 'string') return veiculo;

        const textoPrincipal = [veiculo.marca, veiculo.modelo].filter(Boolean).join(' ');
        return textoPrincipal || veiculo.placa || '-';
    };

    const obterModeloVeiculo = (veiculo) => {
        if (!veiculo) return 'Sem veículo';
        if (typeof veiculo === 'string') return veiculo;

        return veiculo.modelo || veiculo.placa || 'Sem veículo';
    };

    const normalizarServicos = (servicos = []) => {
        return servicos.map((servico) => {
            const id = servico?.idServico ?? servico?.servico?.id ?? servico?.id;
            const preco = servico?.valorAplicado ?? servico?.preco ?? servico?.precoBase ?? 0;
            const nome = servico?.nome ?? servico?.servico?.nome ?? 'Serviço';

            return {
                id: id ?? null,
                nome,
                preco,
                valor: formatarPreco(preco)
            };
        });
    };

    const normalizarOrdem = (ordem) => {
        const servicosOrigem = ordem?.servicos || ordem?.itensServico || ordem?.itens || [];
        const servicos = normalizarServicos(servicosOrigem);
        const statusId = typeof ordem?.status === 'object' ? ordem?.status?.id : ordem?.status;
        const statusDescricao = typeof ordem?.status === 'object' ? ordem?.status?.descricao : null;
        const valorTotal = ordem?.valorTotal ?? ordem?.precoMinimo ?? servicos.reduce(
            (total, servico) => total + (servico.preco || 0),
            0
        );
        const nomeServicoPrincipal =
            servicos[0]?.nome ||
            ordem?.tipoServico ||
            ordem?.nomeServico ||
            ordem?.servico?.nome ||
            'Sem serviço';
        const modeloVeiculo = obterModeloVeiculo(ordem?.veiculo);
        const titulo = ordem?.id ? `OS #${ordem.id} - ${modeloVeiculo}` : `Nova OS - ${modeloVeiculo}`;

        return {
            id: ordem?.id,
            titulo,
            tipo: nomeServicoPrincipal,
            horario: ordem?.horario || (ordem?.dataAgendamento ? formatarHorario(ordem.dataAgendamento) : '--:--'),
            cliente: ordem?.cliente?.nome || ordem?.cliente || '-',
            veiculo: formatarVeiculo(ordem?.veiculo),
            valor: formatarPreco(valorTotal),
            status: statusId,
            statusDescricao,
            dataAgendamento: ordem?.dataAgendamento || '-',
            dataConclusao: ordem?.dtConclusao || ordem?.dataConclusao || '--/--/---- - --:--',
            observacoes: ordem?.observacoes || 'Sem observações.',
            servicos
        };
    };

    const buscarOrdensServico = async () => {
        setLoading(true);
        try {
            const response = await ordemServicoService.listarOrdensGestao({
                pagina: 0,
                tamanho: 50,
                ordenarPor: 'dataAgendamento',
                direcao: 'asc',
                status: filtrosAplicados.status || undefined,
                dataInicio: filtrosAplicados.dataAgendamento || undefined,
                dataFim: filtrosAplicados.dataConclusao || undefined
            });

            const lista = response?.content || response || [];
            setOrdensServico(lista.map(normalizarOrdem));
        } catch (error) {
            setOrdensServico([]);
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao carregar ordens',
                mensagem: error.message || 'Não foi possível carregar as ordens de serviço.',
                duracao: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarOrdensServico();
    }, [periodoSelecionado, filtrosAplicados]);

    const abrirModal = async (ordem) => {
        setOrdemSelecionada(normalizarOrdem(ordem));
        setModalAbertoOrdem(true);

        if (!ordem?.id) {
            return;
        }

        setLoadingDetalhe(true);
        try {
            const detalhe = await ordemServicoService.buscarPorId(ordem.id);
            setOrdemSelecionada(normalizarOrdem(detalhe));
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ALERTA,
                titulo: 'Detalhe indisponível',
                mensagem: error.message || 'Não foi possível carregar os detalhes completos da ordem.',
                duracao: 3000
            });
        } finally {
            setLoadingDetalhe(false);
        }
    };

    const fecharModal = () => {
        setModalAbertoOrdem(false);
        setOrdemSelecionada(null);
    };

    const handleOrdemAtualizada = (ordemAtualizada) => {
        if (!ordemAtualizada?.id) return;

        setOrdensServico((prev) => prev.map((item) =>
            item.id === ordemAtualizada.id ? { ...item, ...ordemAtualizada } : item
        ));

        setOrdemSelecionada((prev) => {
            if (!prev || prev.id !== ordemAtualizada.id) {
                return prev;
            }

            return { ...prev, ...ordemAtualizada };
        });
    };

    const criarNovaOrdemBase = () => ({
        id: null,
        horario: '--:--',
        cliente: 'Selecione o cliente',
        veiculo: 'Selecione o veículo',
        valor: 'R$ 0,00',
        status: 1,
        dataAgendamento: '--/--/---- - --:--',
        dataConclusao: '--/--/---- - --:--',
        observacoes: 'Sem observações.',
        servicos: []
    });

    const handleAplicarFiltros = (filtros) => {
        setFiltrosAplicados(filtros);
    };

    const contarFiltrosAtivos = () => {
        return Object.values(filtrosAplicados).filter(valor => valor !== '').length;
    };

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
                {loading ? (
                    <p className="text-center text-gray-500 py-4">Carregando ordens de serviço...</p>
                ) : ordensServico.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Nenhuma ordem de serviço encontrada.</p>
                ) : (
                    ordensServico.map((ordem) => (
                        <OrdemServicoItem
                            key={ordem.id}
                            ordem={ordem}
                            onItemClick={abrirModal}
                        />
                    ))
                )}
            </div>

            {/* Botão Nova Ordem */}
            <div className="sticky bottom-4 mt-8 left-4 right-4 z-10">
                <button
                    onClick={() => abrirModal(criarNovaOrdemBase())}
                    disabled={loadingDetalhe}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold shadow-lg"
                >
                    {loadingDetalhe ? 'Carregando...' : 'Nova ordem de serviço'}
                </button>
            </div>

            {/* Modal de Filtro */}
            <ModalFiltro
                isOpen={modalFiltroAberto}
                onClose={() => setModalFiltroAberto(false)}
                onAplicarFiltros={handleAplicarFiltros}        
            />

            <ModalOrdemServico
                isOpen={modalAbertoOrdem}
                agendamento={ordemSelecionada}
                onClose={fecharModal}
                onOrdemAtualizada={handleOrdemAtualizada}
            />
        </div>
    );
}