import { apiService } from './ApiService';

export class OrdemServicoService {
    async criarOrdemServico(ordemData) {
        try {
            const response = await apiService.post(`/ordem-servicos`, ordemData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao criar ordem de serviço');
        }
    }

    async buscarOrdemServicoPorUsuario(usuarioId) {
        try {
            const response = await apiService.get(`/ordem-servicos/usuario/${usuarioId}`);
            return response;
        }
        catch (error) {
            throw new Error(error.message || 'Erro ao buscar ordens de serviço do usuário');
        }
    }

    async atualizarStatus(id, novoStatus) {
        try {
            const response = await apiService.patch(`/ordem-servicos/${id}`, { status: novoStatus });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao atualizar status da ordem de serviço');
        }
    }
}