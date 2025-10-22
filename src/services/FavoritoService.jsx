import { apiService } from './ApiService';

export class FavoritoService {
    async buscarFavoritosUsuario(idPessoa) {
        try {
            const response = await apiService.get(`/favoritos/pessoa/${idPessoa}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar favoritos do usuário');
        }
    }

    async adicionarServicoFavorito(idPessoa, idServico) {
        try {
            const body = { idPessoa, idServico };
            const response = await apiService.post(`/favoritos`, body); 
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao adicionar item aos favoritos');
        }
    }

    async removerItemFavorito(idPessoa, idServico) {
        try {
            const body = { idPessoa, idServico };
            const response = await apiService.delete(`/favoritos`, { data: body });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao remover item dos favoritos');
        }
    }
}