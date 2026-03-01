import { apiService } from './ApiService';

export class OrdemServicoService {
    BASE_URL = '/ordem-servicos';

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

    async atualizarStatus(id, novoStatus) {
        try {
            const response = await apiService.patch(`${this.BASE_URL}/${id}`, { status: novoStatus });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao atualizar status da ordem de serviço');
        }
    }
}

export const ordemServicoService = new OrdemServicoService();