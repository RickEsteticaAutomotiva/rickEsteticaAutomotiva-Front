import { Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { OrdemServicoItem } from './ordem-servico-item/OrdemServicoItem';
import { ModalOrdemServico } from '../agendamento/modal-ordem-servico/ModalOrdemServico';
import { DropdownButton } from '../../../components/gerente/dropdown-button/DropdownButton';
import { ModalFiltro } from './modal-filtro/ModalFiltro';
import { ModalCriarOrdemServico } from './modal-criar-ordem/ModalCriarOrdemServico';
import { ordemServicoService } from '../../../services/OrdemServicoService';
import { useToast } from '../../../context/ToastContext';
import { TiposToast } from '../../../utils/enum/TiposToast';
import { formatarDataHorarioCompleto, formatarHorario, formatarPreco } from '../../../utils';
import { Paginacao } from '../../../components/paginacao/Paginacao';



export function OrdensServico() {
    const [periodoSelecionado, setPeriodoSelecionado] = useState({ id: 0, valor: 'Todos' });
    const [dropdownAberto, setDropdownAberto] = useState(false);
    const [dropdownOrdenacaoAberto, setDropdownOrdenacaoAberto] = useState(false);
    const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState({ id: 'idMaior', valor: 'ID maior' });
    const [modalFiltroAberto, setModalFiltroAberto] = useState(false);
    const [modalAbertoOrdem, setModalAbertoOrdem] = useState(false);
    const [modalCriarAberto, setModalCriarAberto] = useState(false);
    const [ordemSelecionada, setOrdemSelecionada] = useState(null);
    const [filtrosAplicados, setFiltrosAplicados] = useState({ status: '', filtro: '', dataAgendamento: '', dataConclusao: '' });
    const [ordensServico, setOrdensServico] = useState([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [tamanhoPagina] = useState(12);
    const [loading, setLoading] = useState(true);
    const [loadingDetalhe, setLoadingDetalhe] = useState(false);
    const { mostrarToast } = useToast();
    
    const periodos = [
        { id: 0, valor: 'Todos' },
        { id: 1, valor: 'Dia' },
        { id: 2, valor: 'Semana' },
        { id: 3, valor: 'Mês' },
        { id: 4, valor: 'Ano' }
    ];

    const ordenacoes = [
        { id: 'emAnalise', valor: 'Em análise', ordenarPor: 'status.id,dataAgendamento', direcao: 'asc' },
        { id: 'idMaior', valor: 'ID maior', ordenarPor: 'id', direcao: 'desc' },
        { id: 'idMenor', valor: 'ID menor', ordenarPor: 'id', direcao: 'asc' },
        { id: 'dataRecente', valor: 'Data mais recente', ordenarPor: 'dataAgendamento,id', direcao: 'desc' },
        { id: 'dataAntiga', valor: 'Data mais antiga', ordenarPor: 'dataAgendamento,id', direcao: 'asc' },
        { id: 'valorMaior', valor: 'Maior valor', ordenarPor: 'precoMinimo,id', direcao: 'desc' },
        { id: 'valorMenor', valor: 'Menor valor', ordenarPor: 'precoMinimo,id', direcao: 'asc' }
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
        const dataAgendamentoOriginal = ordem?.dataAgendamento || null;
        const dataConclusaoOriginal = ordem?.dtConclusao || ordem?.dataConclusao || null;

        return {
            id: ordem?.id,
            titulo,
            tipo: nomeServicoPrincipal,
            horario: ordem?.horario || (ordem?.dataAgendamento ? formatarHorario(ordem.dataAgendamento) : '--:--'),
            cliente: ordem?.cliente?.nome || ordem?.cliente || '-',
            veiculo: formatarVeiculo(ordem?.veiculo),
            valor: formatarPreco(valorTotal),
            valorNumerico: Number(valorTotal) || 0,
            status: statusId,
            statusDescricao,
            dataAgendamento: dataAgendamentoOriginal ? formatarDataHorarioCompleto(dataAgendamentoOriginal) : '-',
            dataAgendamentoOriginal,
            dataConclusao: dataConclusaoOriginal ? formatarDataHorarioCompleto(dataConclusaoOriginal) : '--/--/---- às --:--',
            observacoes: ordem?.observacoes || 'Sem observações.',
            servicos
        };
    };

    const formatarDataFiltro = (data) => {
        return data.toISOString().split('T')[0];
    };

    const extrairPaginacao = (response) => {
        if (Array.isArray(response)) {
            return {
                lista: response,
                totalPaginas: response.length > 0 ? 1 : 0
            };
        }

        const lista = Array.isArray(response?.content)
            ? response.content
            : (Array.isArray(response?.data?.content) ? response.data.content : []);

        const totalPaginasBackend =
            response?.totalPages ??
            response?.totalPaginas ??
            response?.page?.totalPages ??
            response?.data?.totalPages ??
            response?.data?.totalPaginas ??
            response?.data?.page?.totalPages;

        const totalPaginasResolvido = Number(totalPaginasBackend);
        const totalPaginas = Number.isFinite(totalPaginasResolvido) && totalPaginasResolvido > 0
            ? totalPaginasResolvido
            : (lista.length > 0 ? 1 : 0);

        return {
            lista,
            totalPaginas
        };
    };

    const resolverFaixaDatas = () => {
        if (filtrosAplicados?.dataAgendamento || filtrosAplicados?.dataConclusao) {
            return {
                dataInicio: filtrosAplicados?.dataAgendamento || undefined,
                dataFim: filtrosAplicados?.dataConclusao || undefined
            };
        }

        if (periodoSelecionado.id === 0) {
            return {
                dataInicio: undefined,
                dataFim: undefined
            };
        }

        const hoje = new Date();
        const inicio = new Date(hoje);

        if (periodoSelecionado.id === 1) {
            inicio.setHours(0, 0, 0, 0);
        }

        if (periodoSelecionado.id === 2) {
            inicio.setDate(hoje.getDate() - 7);
        }

        if (periodoSelecionado.id === 3) {
            inicio.setMonth(hoje.getMonth() - 1);
        }

        if (periodoSelecionado.id === 4) {
            inicio.setFullYear(hoje.getFullYear() - 1);
        }

        return {
            dataInicio: formatarDataFiltro(inicio),
            dataFim: formatarDataFiltro(hoje)
        };
    };

    const resolverOrdenacaoApi = () => {
        const selecionada = ordenacoes.find((item) => item.id === ordenacaoSelecionada.id);

        return {
            ordenarPor: selecionada?.ordenarPor,
            direcao: selecionada?.direcao
        };
    };

    const aplicarOrdenacaoLocal = (lista = []) => {
        const resultado = [...lista];

        const compararData = (a, b, asc = true) => {
            const dataA = new Date(a?.dataAgendamentoOriginal || a?.dataAgendamento || 0).getTime();
            const dataB = new Date(b?.dataAgendamentoOriginal || b?.dataAgendamento || 0).getTime();
            const seguroA = Number.isNaN(dataA) ? 0 : dataA;
            const seguroB = Number.isNaN(dataB) ? 0 : dataB;
            return asc ? seguroA - seguroB : seguroB - seguroA;
        };

        if (ordenacaoSelecionada.id === 'dataRecente') {
            resultado.sort((a, b) => compararData(a, b, false));
            return resultado;
        }

        if (ordenacaoSelecionada.id === 'dataAntiga') {
            resultado.sort((a, b) => compararData(a, b, true));
            return resultado;
        }

        if (ordenacaoSelecionada.id === 'valorMaior') {
            resultado.sort((a, b) => (b?.valorNumerico || 0) - (a?.valorNumerico || 0));
            return resultado;
        }

        if (ordenacaoSelecionada.id === 'valorMenor') {
            resultado.sort((a, b) => (a?.valorNumerico || 0) - (b?.valorNumerico || 0));
            return resultado;
        }

        if (ordenacaoSelecionada.id === 'idMaior') {
            resultado.sort((a, b) => (b?.id || 0) - (a?.id || 0));
            return resultado;
        }

        if (ordenacaoSelecionada.id === 'idMenor') {
            resultado.sort((a, b) => (a?.id || 0) - (b?.id || 0));
            return resultado;
        }

        resultado.sort((a, b) => {
            const aEmAnalise = Number(a?.status) === 1 ? 0 : 1;
            const bEmAnalise = Number(b?.status) === 1 ? 0 : 1;

            if (aEmAnalise !== bEmAnalise) {
                return aEmAnalise - bEmAnalise;
            }

            return compararData(a, b, true);
        });

        return resultado;
    };

    const buscarOrdensServico = useCallback(async () => {
        setLoading(true);
        try {
            const faixaDatas = resolverFaixaDatas();
            const ordenacaoApi = resolverOrdenacaoApi();
            const response = await ordemServicoService.listarOrdensGestao({
                pagina: paginaAtual,
                tamanho: tamanhoPagina,
                status: filtrosAplicados.status || undefined,
                filtro: filtrosAplicados.filtro || undefined,
                dataInicio: faixaDatas.dataInicio,
                dataFim: faixaDatas.dataFim,
                ordenarPor: ordenacaoApi.ordenarPor,
                direcao: ordenacaoApi.direcao
            });

            const { lista, totalPaginas: totalPaginasResponse } = extrairPaginacao(response);
            setOrdensServico(aplicarOrdenacaoLocal(lista.map(normalizarOrdem)));
            setTotalPaginas(totalPaginasResponse);
        } catch (error) {
            setOrdensServico([]);
            setTotalPaginas(0);
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao carregar ordens',
                mensagem: error.message || 'Não foi possível carregar as ordens de serviço.',
                duracao: 4000
            });
        } finally {
            setLoading(false);
        }
    }, [filtrosAplicados, mostrarToast, ordenacaoSelecionada.id, paginaAtual, periodoSelecionado.id, tamanhoPagina]);

    useEffect(() => {
        buscarOrdensServico();
    }, [buscarOrdensServico]);

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

        setOrdensServico((prev) => prev.map((item) => {
            if (item.id !== ordemAtualizada.id) {
                return item;
            }

            return { ...item, ...ordemAtualizada };
        }));

        setOrdemSelecionada((prev) => {
            if (!prev || prev.id !== ordemAtualizada.id) {
                return prev;
            }

            return { ...prev, ...ordemAtualizada };
        });
    };

    const handleAplicarFiltros = (filtros) => {
        setFiltrosAplicados(filtros);
        setPaginaAtual(0);
    };

    const handleMudarPagina = (novaPagina) => {
        if (novaPagina < 0 || novaPagina >= totalPaginas || novaPagina === paginaAtual) {
            return;
        }

        setPaginaAtual(novaPagina);
    };

    useEffect(() => {
        setPaginaAtual(0);
    }, [ordenacaoSelecionada.id, periodoSelecionado.id]);

    const handleOrdemCriada = async (ordemCriada) => {
        await buscarOrdensServico();

        if (!ordemCriada?.id) {
            return;
        }

        try {
            const detalhe = await ordemServicoService.buscarPorId(ordemCriada.id);
            setOrdemSelecionada(normalizarOrdem(detalhe));
            setModalAbertoOrdem(true);
        } catch {
            // A listagem já foi atualizada; sem detalhe não bloqueia o fluxo.
        }
    };

    const contarFiltrosAtivos = () => {
        return Object.values(filtrosAplicados).filter((valor) => valor !== '').length;
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-2 ps-4">
                <div className="flex items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-2">
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

                    <div className="relative">
                        <DropdownButton
                            valorSelecionado={ordenacaoSelecionada}
                            setValorSelecionado={setOrdenacaoSelecionada}
                            dropdownAberto={dropdownOrdenacaoAberto}
                            setDropdownAberto={setDropdownOrdenacaoAberto}
                            valores={ordenacoes}
                        />
                    </div>
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

            {!loading && ordensServico.length > 0 && totalPaginas > 0 && (
                <Paginacao
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    onMudarPagina={handleMudarPagina}
                />
            )}

            {/* Botão Nova Ordem */}
            <div className="sticky bottom-4 mt-8 left-4 right-4 z-10">
                <button
                    onClick={() => setModalCriarAberto(true)}
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
                filtrosIniciais={filtrosAplicados}
            />

            <ModalCriarOrdemServico
                isOpen={modalCriarAberto}
                onClose={() => setModalCriarAberto(false)}
                onCriada={handleOrdemCriada}
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