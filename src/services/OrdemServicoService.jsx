import { apiService } from './ApiService';

export class OrdemServicoService {
    BASE_URL = '/ordem-servicos';
    BASE_URL_GESTAO = '/ordem-servicos-gestao';

    STATUS_POR_ID = {
        1: 'AGUARDANDO',
        2: 'EM_ANDAMENTO',
        3: 'AGUARDANDO_PECAS',
        4: 'CANCELADO',
        5: 'CONCLUIDO'
    };

    ID_POR_STATUS = {
        AGUARDANDO: 1,
        EM_ANDAMENTO: 2,
        AGUARDANDO_PECAS: 3,
        CANCELADO: 4,
        CONCLUIDO: 5
    };

    normalizarStatusParaBackend(status) {
        if (status === undefined || status === null || status === '') {
            return null;
        }

        if (typeof status === 'number') {
            return status;
        }

        if (typeof status === 'string') {
            const numeroStatus = Number(status);
            if (!Number.isNaN(numeroStatus)) {
                return numeroStatus;
            }

            return this.ID_POR_STATUS[status] ?? status;
        }

        return status;
    }

    async buscarAgendamentosHoje() {
        try {
            const response = await apiService.get(`${this.BASE_URL}/hoje`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar agendamentos de hoje');
        }
    }

    async listarOrdensGestao(parametros = {}) {
        try {
            const {
                status,
                filtro,
                dataInicio,
                dataFim,
                pagina = 0,
                tamanho = 20,
                ordenarPor,
                direcao
            } = parametros;

            const queryParams = new URLSearchParams();
            queryParams.set('pagina', pagina.toString());
            queryParams.set('tamanho', tamanho.toString());

            if (status !== undefined && status !== null && status !== '') {
                queryParams.set('status', status.toString());
            }

            if (filtro && filtro.trim()) {
                queryParams.set('filtro', filtro.trim());
            }

            if (ordenarPor) {
                queryParams.set('ordenarPor', ordenarPor);
            }

            if (direcao) {
                queryParams.set('direcao', direcao);
            }

            if (dataInicio) {
                queryParams.set('dataInicio', dataInicio);
            }

            if (dataFim) {
                queryParams.set('dataFim', dataFim);
            }

            const response = await apiService.get(`${this.BASE_URL_GESTAO}?${queryParams.toString()}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar ordens de serviço para gestão');
        }
    }

    async buscarPorId(id) {
        try {
            const response = await apiService.get(`${this.BASE_URL_GESTAO}/${id}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar detalhes da ordem de serviço');
        }
    }

    async criarOrdemServico(ordemData) {
        try {
            const response = await apiService.post(this.BASE_URL, ordemData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao criar ordem de serviço');
        }
    }

    async criarOrdemServicoGestao(ordemData) {
        const servicosNormalizados = Array.isArray(ordemData?.servicos)
            ? ordemData.servicos.map((servico) => Number(servico)).filter((id) => !Number.isNaN(id))
            : [];

        const veiculo = ordemData?.veiculo ?? ordemData?.veiculoId;
        const payload = {
            dataAgendamento: ordemData?.dataAgendamento,
            ...(veiculo !== undefined && veiculo !== null ? { veiculo: Number(veiculo) } : {}),
            servicos: servicosNormalizados,
            ...(ordemData?.precoMinimo !== undefined ? { precoMinimo: ordemData.precoMinimo } : {}),
            ...(ordemData?.observacoes ? { observacoes: ordemData.observacoes } : {})
        };

        try {
            const response = await apiService.post(this.BASE_URL_GESTAO, payload);
            return response;
        } catch (error) {
            console.error('[OrdemServicoService.criarOrdemServicoGestao] Falha ao criar ordem', {
                endpoint: this.BASE_URL_GESTAO,
                payload,
                mensagem: error?.message
            });
            throw new Error(error?.message || 'Erro ao criar ordem de serviço pela gestão');
        }
    }

    async buscarOrdemServicoPorUsuario(usuarioId) {
        try {
            const response = await apiService.get(`${this.BASE_URL}/usuario/${usuarioId}`);
            return response;
        }
        catch (error) {
            throw new Error(error.message || 'Erro ao buscar ordens de serviço do usuário');
        }
    }

    async buscarMinhasOrdens() {
        try {
            const response = await apiService.get(`${this.BASE_URL}/me`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar ordens de serviço do usuário autenticado');
        }
    }

    async atualizarStatus(id, novoStatus) {
        try {
            const response = await apiService.patch(`${this.BASE_URL}/${id}`, { status: novoStatus });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao atualizar status da ordem de serviço');
        }
    }

    async atualizarStatusGestao(id, novoStatus) {
        try {
            const statusNormalizado = this.normalizarStatusParaBackend(novoStatus);
            const response = await apiService.patch(`${this.BASE_URL_GESTAO}/${id}`, { status: statusNormalizado });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao atualizar status da ordem de serviço');
        }
    }

    async atualizarDadosGestao(id, dadosOrdem = {}) {
        const statusNormalizado = this.normalizarStatusParaBackend(dadosOrdem?.status);

        const payload = {
            ...(dadosOrdem?.dataAgendamento ? { dataAgendamento: dadosOrdem.dataAgendamento } : {}),
            ...(dadosOrdem?.observacoes !== undefined ? { observacoes: dadosOrdem.observacoes } : {}),
            ...(statusNormalizado !== undefined && statusNormalizado !== null && statusNormalizado !== ''
                ? { status: statusNormalizado }
                : {})
        };

        if (Object.keys(payload).length === 0) {
            throw new Error('Nenhum dado válido foi informado para atualização da ordem.');
        }

        try {
            const response = await apiService.patch(`${this.BASE_URL_GESTAO}/${id}`, payload);
            const resultado = response?.data ?? response;
            return resultado;
        } catch (error) {
            throw new Error(error.message || 'Erro ao atualizar dados da ordem de serviço');
        }
    }

    async adicionarServicos(id, servicos) {
        const payloadServicos = (servicos || [])
            .map((servico) => {
                const idServico = servico?.idServico ?? servico?.id;
                const valorAplicado = servico?.valorAplicado ?? servico?.preco;

                if (idServico === undefined || idServico === null) {
                    return null;
                }

                return {
                    idServico,
                    ...(typeof valorAplicado === 'number' ? { valorAplicado } : {})
                };
            })
            .filter(Boolean);

        if (payloadServicos.length === 0) {
            throw new Error('Nenhum serviço válido foi informado para adição.');
        }

        try {
            const endpoint = `${this.BASE_URL_GESTAO}/${id}/servicos`;
            const body = { servicos: payloadServicos };
            await apiService.post(endpoint, body);
            const response = await apiService.get(`${this.BASE_URL_GESTAO}/${id}`);
            return response;
        } catch (error) {
            console.error('[OrdemServicoService.adicionarServicos] Erro:', error);
            throw new Error(error.message || 'Erro ao adicionar serviços na ordem de serviço');
        }
    }

    async atualizarServicoDaOrdem(id, servicoId, servicoData) {
        const endpoint = `${this.BASE_URL_GESTAO}/${id}/servicos/${servicoId}`;
        const valor = servicoData?.valorAplicado ?? servicoData?.valor ?? servicoData?.preco;

        const tentativasPayload = [
            servicoData,
            { valorAplicado: valor },
            { valor },
            { preco: valor }
        ].filter((payload) => payload && Object.values(payload).every((item) => item !== undefined));

        let ultimoErro = null;

        for (const payload of tentativasPayload) {
            try {
                const response = await apiService.patch(endpoint, payload);
                return response;
            } catch (error) {
                ultimoErro = error;
            }
        }

        throw new Error(ultimoErro?.message || 'Erro ao atualizar serviço da ordem de serviço');
    }

    async removerServicoDaOrdem(id, servicoId) {
        try {
            await apiService.delete(`${this.BASE_URL_GESTAO}/${id}/servicos/${servicoId}`);
            const response = await apiService.get(`${this.BASE_URL_GESTAO}/${id}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao remover serviço da ordem de serviço');
        }
    }
}

export const ordemServicoService = new OrdemServicoService();
