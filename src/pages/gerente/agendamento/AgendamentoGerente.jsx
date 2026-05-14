import { Button } from "../../../components/button/Button";
import { CardAgendamento } from "../../../components/gerente/card/card-agendamento/CardAgendamento";
import { CardPequeno } from "../../../components/gerente/card/card-pequeno/CardPequeno";
import { Clock, BanknoteArrowUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ModalOrdemServico } from "./modal-ordem-servico/ModalOrdemServico";
import { ordemServicoService } from '../../../services/OrdemServicoService';
import { servicosService } from '../../../services/ServicosService';
import { veiculoService } from '../../../services/VeiculoService';
import { useToast } from '../../../context/ToastContext';
import { TiposToast } from '../../../utils/enum/TiposToast';
import { formatarPlacaCarro } from '../../../utils';
import { formatarDataCompleta, formatarDataHorarioCompleto, formatarHorario, formatarPreco } from '../../../utils';

const formatarVeiculo = (veiculo) => {
    if (!veiculo) return '-';
    if (typeof veiculo === 'string') return veiculo;

    const textoPrincipal = [veiculo.marca, veiculo.modelo].filter(Boolean).join(' ');
    return textoPrincipal || veiculo.placa || '-';
};

const normalizarServicos = (servicos = []) => {
    return servicos.map((servico) => {
        if (typeof servico === 'number') {
            return {
                id: servico,
                nome: `Serviço ${servico}`,
                preco: 0,
                valor: formatarPreco(0)
            };
        }

        const id = servico.id ?? servico.idServico;
        const preco = servico.valorAplicado ?? servico.preco ?? servico.precoBase ?? 0;

        return {
            id,
            nome: servico.nome ?? servico.servico?.nome ?? `Serviço ${id}`,
            preco,
            valor: formatarPreco(preco)
        };
    });
};

const resolverDataAgendamento = (ordem) => {
    return ordem?.dataAgendamento || ordem?.dataHora || ordem?.data || null;
};

const resolverPlacaVeiculo = (veiculo) => {
    if (!veiculo) return null;

    if (typeof veiculo === 'string') {
        return veiculo.trim() || null;
    }

    return veiculo.placa || veiculo.numeroPlaca || veiculo.licensePlate || veiculo.placaMercosul || null;
};

const resolverVeiculoId = (ordem) => {
    const veiculo = ordem?.veiculoId ?? ordem?.veiculo;

    if (typeof veiculo === 'number') {
        return veiculo;
    }

    if (typeof veiculo === 'string' && /^\d+$/.test(veiculo.trim())) {
        return Number(veiculo);
    }

    return null;
};

const normalizarAgendamento = (ordem) => {
    const servicos = normalizarServicos(ordem?.servicos || []);
    const valorTotal = ordem?.valorTotal ?? ordem?.precoMinimo ?? servicos.reduce(
        (total, servico) => total + (servico.preco || 0),
        0
    );
    const dataAgendamentoOriginal = resolverDataAgendamento(ordem);
    const dataConclusaoOriginal = ordem?.dtConclusao || ordem?.dataConclusao || null;
    const veiculoDetalhado = typeof ordem?.veiculo === 'object' && ordem?.veiculo !== null ? ordem.veiculo : null;
    const placaBruta = resolverPlacaVeiculo(veiculoDetalhado || ordem?.veiculo);
    const placaVeiculo = placaBruta ? formatarPlacaCarro(placaBruta) : null;

    return {
        id: ordem?.id,
        horario: ordem?.horario || (dataAgendamentoOriginal ? formatarHorario(dataAgendamentoOriginal) : '--:--'),
        cliente: ordem?.cliente?.nome || ordem?.cliente || '-',
        telefone: ordem?.telefone || ordem?.cliente?.telefone || ordem?.clienteTelefone || null,
        veiculo: formatarVeiculo(ordem?.veiculo),
        veiculoDetalhado,
        placaVeiculo,
        valor: formatarPreco(valorTotal),
        status: ordem?.status,
        dataAgendamento: dataAgendamentoOriginal ? formatarDataHorarioCompleto(dataAgendamentoOriginal) : '-',
        dataAgendamentoOriginal,
        dataConclusao: dataConclusaoOriginal ? formatarDataHorarioCompleto(dataConclusaoOriginal) : '--/--/---- às --:--',
        observacoes: ordem?.observacoes || 'Sem observações.',
        servicos
    };
};

const extrairListaAgendamentos = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.content)) {
        return response.content;
    }

    return [];
};

const resolverLinkWhatsApp = (telefone) => {
    if (!telefone) return null;

    const apenasDigitos = String(telefone).replace(/\D/g, '');

    if (!apenasDigitos) return null;

    const telefoneComPais = apenasDigitos.startsWith('55') ? apenasDigitos : `55${apenasDigitos}`;

    return `https://wa.me/${telefoneComPais}`;
};

const resolverReferenciasOrdem = async (ordem) => {
    if (!ordem) return ordem;

    const ordemResolvida = { ...ordem };
    const servicosOrigem = ordem?.servicos || ordem?.itensServico || ordem?.itens || [];
    const veiculoId = resolverVeiculoId(ordemResolvida);

    if (Array.isArray(servicosOrigem) && servicosOrigem.length > 0 && typeof servicosOrigem[0] === 'number') {
        const idsUnicos = [...new Set(servicosOrigem)];

        const detalhesServicos = await Promise.all(
            idsUnicos.map(async (idServico) => {
                try {
                    const detalhe = await servicosService.buscarPorId(idServico);
                    return [idServico, detalhe];
                } catch {
                    return [idServico, null];
                }
            })
        );

        const mapaServicos = new Map(detalhesServicos);

        ordemResolvida.servicos = servicosOrigem.map((idServico) => {
            const detalhe = mapaServicos.get(idServico);

            if (!detalhe) {
                return { id: idServico, nome: `Serviço ${idServico}`, preco: 0 };
            }

            return {
                ...detalhe,
                id: detalhe.id ?? idServico
            };
        });
    }

    if (veiculoId !== null) {
        try {
            ordemResolvida.veiculo = await veiculoService.buscarPorId(veiculoId);
        } catch {
            ordemResolvida.veiculo = `Veículo ${veiculoId}`;
        }
    }

    return ordemResolvida;
};

export function AgendamentoGerente() {
    const [modalAberto, setModalAberto] = useState(false);
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingDetalhe, setLoadingDetalhe] = useState(false);
    const { mostrarToast } = useToast();
    const dataHojeFormatada = formatarDataCompleta(new Date());

    const buscarAgendamentosHoje = async () => {
        setLoading(true);
        try {
            const response = await ordemServicoService.buscarAgendamentosHoje();
            const lista = extrairListaAgendamentos(response);

            const listaResolvida = await Promise.all(
                lista.map((ordem) => resolverReferenciasOrdem(ordem))
            );

            setAgendamentos(listaResolvida.map(normalizarAgendamento));
        } catch (error) {
            setAgendamentos([]);
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao carregar agendamentos de hoje',
                mensagem: error.message || 'Não foi possível carregar os agendamentos de hoje.',
                duracao: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        buscarAgendamentosHoje();
    }, []);

    const abrirModal = async (agendamento) => {
        if (!agendamento) return;

        // Abre imediatamente com os dados já carregados da listagem.
        setAgendamentoSelecionado(agendamento);
        setModalAberto(true);

        setLoadingDetalhe(true);
        try {
            const detalhe = await ordemServicoService.buscarPorId(agendamento.id);
            const detalheResolvido = await resolverReferenciasOrdem(detalhe);
            setAgendamentoSelecionado(normalizarAgendamento(detalheResolvido));
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
        setModalAberto(false);
        setAgendamentoSelecionado(null);
    };

    const proximoAgendamento = useMemo(() => {
        const pendentes = agendamentos.filter((agendamento) => agendamento.status !== 4 && agendamento.status !== 5);
        if (pendentes.length === 0) {
            return null;
        }

        return [...pendentes].sort((a, b) => {
            const dataA = new Date(a.dataAgendamentoOriginal || a.dataAgendamento || 0).getTime();
            const dataB = new Date(b.dataAgendamentoOriginal || b.dataAgendamento || 0).getTime();
            return dataA - dataB;
        })[0];
    }, [agendamentos]);

    const linkWhatsAppProximoAgendamento = resolverLinkWhatsApp(proximoAgendamento?.telefone);

    const handleOrdemAtualizada = (ordemAtualizada) => {
        if (!ordemAtualizada?.id) return;

        setAgendamentos((prev) => prev.map((item) =>
            item.id === ordemAtualizada.id ? { ...item, ...ordemAtualizada } : item
        ));
        setAgendamentoSelecionado((prev) => {
            if (!prev || prev.id !== ordemAtualizada.id) {
                return prev;
            }

            return { ...prev, ...ordemAtualizada };
        });
    };

    return (
        <div className="mt-4">
            <div className="flex justify-center bg-white rounded-2xl p-5 mb-6 shadow-sm overflow-hidden">
                <div className="flex w-full flex-col items-center gap-5">
                    <h2 className="text-2xl font-semibold text-center">Próximo agendamento</h2>
                    <div className="grid w-full grid-cols-2 gap-x-6 gap-y-7 md:max-w-3xl md:gap-x-12">
                        <CardPequeno
                            texto={proximoAgendamento?.servicos?.[0]?.nome || 'Sem agendamento'}
                            label="Servico"
                        />
                        <CardPequeno texto={proximoAgendamento?.veiculo || '-'} label="Veículo" />
                        <CardPequeno
                            texto={proximoAgendamento?.horario || '--:--'}
                            label="Horário"
                            icon={Clock}
                        />
                        <CardPequeno texto={proximoAgendamento?.valor || 'R$ 0,00'} label="Valor" icon={BanknoteArrowUp} />
                    </div>

                    <div className="flex w-full flex-wrap items-center justify-center gap-3">
                        {linkWhatsAppProximoAgendamento && (
                            <a
                                href={linkWhatsAppProximoAgendamento}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-36 items-center justify-center gap-2 rounded-lg bg-green-600 px-8 py-1 font-semibold text-white transition-colors duration-200 hover:bg-green-500"
                                aria-label="Abrir conversa no WhatsApp"
                            >
                                <i className="bi bi-whatsapp text-base" aria-hidden="true"></i>
                                WhatsApp
                            </a>
                        )}
                        <Button
                            texto={loadingDetalhe ? "Carregando..." : "Detalhes"}
                            className="w-36 flex items-center justify-center"
                            onClick={() => proximoAgendamento && abrirModal(proximoAgendamento)}
                        />
                    </div>
                </div>
            </div>
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold">Agendamentos de hoje</h2>
                <p className="text-sm text-gray-500 capitalize">{dataHojeFormatada}</p>
            </div>

            <div>
                {loading ? (
                    <p className="text-center text-gray-500 py-4">Carregando agendamentos de hoje...</p>
                ) : agendamentos.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Nenhum agendamento encontrado para hoje.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        {agendamentos.map((agendamento) => (
                            <CardAgendamento
                                key={agendamento.id}
                                agendamento={agendamento}
                                imagem={<Clock />}
                                onDetalhesClick={abrirModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ModalOrdemServico
                isOpen={modalAberto}
                agendamento={agendamentoSelecionado}
                onClose={fecharModal}
                onOrdemAtualizada={handleOrdemAtualizada}
            />

        </div>
    );
}