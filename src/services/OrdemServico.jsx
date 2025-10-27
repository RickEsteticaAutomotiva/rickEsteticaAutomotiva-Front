import { apiService } from './ApiService';

export class OrdemServico {
    async criarOrdemServico(ordemData) {
        try {
            const response = await apiService.post(`/ordem-servicos`, ordemData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao criar ordem de serviço');
        }
    }
}