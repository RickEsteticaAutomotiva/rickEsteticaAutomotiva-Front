import { apiService } from './ApiService';

export class OrdemServicoService {
    BASE_URL = '/ordem-servicos';
    BASE_URL_GESTAO = '/ordem-servicos-gestao';

    async listarOrdensGestao(parametros = {}) {
        try {
            const {
                status,
                dataInicio,
                dataFim,
                pagina = 0,
                tamanho = 20,
                ordenarPor = 'dataAgendamento',
                direcao = 'desc'
            } = parametros;

            const queryParams = new URLSearchParams({
                pagina: pagina.toString(),
                tamanho: tamanho.toString(),
                ordenarPor,
                direcao
            });

            if (status !== undefined && status !== null && status !== '') {
                queryParams.set('status', status.toString());
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
            const response = await apiService.patch(`${this.BASE_URL_GESTAO}/${id}`, { status: novoStatus });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao atualizar status da ordem de serviço');
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

        console.log('[OrdemServicoService.adicionarServicos] ID Ordem:', id, 'Serviços:', payloadServicos);

        try {
            const endpoint = `${this.BASE_URL_GESTAO}/${id}/servicos`;
            const body = { servicos: payloadServicos };
            console.log(`[OrdemServicoService.adicionarServicos] POST ${endpoint}`, body);
            await apiService.post(endpoint, body);

            console.log('[OrdemServicoService.adicionarServicos] Todos os serviços adicionados, buscando ordem atualizada...');
            const response = await apiService.get(`${this.BASE_URL_GESTAO}/${id}`);
            console.log('[OrdemServicoService.adicionarServicos] Resposta final:', response);
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
