import { apiService } from './ApiService';

export class DashboardService {
    async buscarCancelamentos() {
        try {
            const response = await apiService.get(`dashboard/cancelamentos`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar cancelamentos');
        }
    }

    async fluxoCaixa() {
        try {
            const response = await apiService.get(`dashboard/fluxo-caixa`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar flux de caixa');
        }
    }

    async faturamentoPorServico() {
        try {
            const response = await apiService.get(`dashboard/faturamento-servicos`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar faturamento por serviço');
        }
    }

    async totalOrdens() {
        try {
            const response = await apiService.get(`dashboard/total-ordens`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar total de ordens');
        }
    }

    async ticketMedio() {
        try {
            const response = await apiService.get(`dashboard/ticket-medio`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar ticket Medio');
        }
    }


    async servicosConcluidos() {
        try {
            const response = await apiService.get(`dashboard/servicos-concluidos`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar servicos concluidos');
        }
    }

        async faturamento() {
        try {
            const response = await apiService.get(`dashboard/faturamento`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar faturamento');
        }
    }
    
}