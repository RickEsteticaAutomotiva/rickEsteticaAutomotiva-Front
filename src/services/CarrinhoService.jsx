import { apiService } from './ApiService';

export class CarrinhoService {
    async buscarCarrinhoUsuario(idPessoa) {
        try {
            const response = await apiService.get(`/carrinhos/${idPessoa}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar carrinho do usuário');
        }
    }

    async adicionarServicoCarrinho(idPessoa, idServico) {
        try {
            const body = { idPessoa, idServico };
            const response = await apiService.post(`/carrinhos`, body); 
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao adicionar item ao carrinho');
        }
    }

    async removerItemCarrinho(idPessoa, idServico) {
        try {
            const body = { idPessoa, idServico };
            const response = await apiService.delete(`/carrinhos`, { data: body });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao remover item do carrinho');
        }
    }
}