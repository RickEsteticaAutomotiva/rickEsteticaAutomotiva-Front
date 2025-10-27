import { apiService } from './ApiService';

export class VeiculoService {
    async buscarVeiculosPorUsuario(idPessoa) {
        try {
            const response = await apiService.get(`/veiculos/${idPessoa}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar veículos do usuário');
        }
    }

    async adicionarVeiculo(veiculoData) {
        try {
            const response = await apiService.post(`/veiculos`, veiculoData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao adicionar veículo');
        }
    }

    async atualizarVeiculo(veiculoData) {
        try {
            const response = await apiService.patch(`/veiculos/${veiculoData.id}`, veiculoData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao atualizar veículo');
        }
    }

    async removerVeiculo(idVeiculo) {
        try {
            const response = await apiService.delete(`/veiculos/${idVeiculo}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao remover veículo');
        }
    }
}