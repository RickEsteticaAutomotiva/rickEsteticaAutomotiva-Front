import { apiService } from './ApiService';

export class VeiculoService {
    BASE_URL = '/veiculos';

    async buscarPorId(idVeiculo) {
        try {
            const response = await apiService.get(`${this.BASE_URL}/${idVeiculo}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar veículo');
        }
    }

    async buscarVeiculosPorUsuario(idPessoa) {
        try {
            const response = await apiService.get(`${this.BASE_URL}/pessoa/${idPessoa}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar veículos do usuário');
        }
    }

    async adicionarVeiculo(veiculoData) {
        try {
            const response = await apiService.post(this.BASE_URL, veiculoData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao adicionar veículo');
        }
    }

    async atualizarVeiculo(veiculoData) {
        try {
            const response = await apiService.patch(`${this.BASE_URL}/${veiculoData.id}`, veiculoData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao atualizar veículo');
        }
    }

    async removerVeiculo(idVeiculo) {
        try {
            const response = await apiService.delete(`${this.BASE_URL}/${idVeiculo}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao remover veículo');
        }
    }
}

export const veiculoService = new VeiculoService();