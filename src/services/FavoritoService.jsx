import { apiService } from './ApiService';

export class FavoritoService {
    async buscarFavoritosUsuario(idPessoa) {
        try {
            const response = await apiService.get(`/favoritos/${idPessoa}`);
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

    async removerItemFavorito(idFavorito) {
            try {
            const response = await apiService.delete(`/favoritos/${idFavorito}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao remover item dos favoritos');
        }
    }
}