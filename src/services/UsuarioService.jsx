import { apiService } from './ApiService';

export class UsuarioService {
    async obterPerfil(id) {
        try {
            const response = await apiService.get(`/pessoas/${id}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao obter informações do usuário');
        }
    }

    async atualizarPerfil(id, dadosAtualizados) {
        try {
            const response = await apiService.put(`/pessoas/${id}`, dadosAtualizados);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao atualizar informações do usuário');
        }
    }

    async deletarUsuario(id) {
        try {
            const response = await apiService.delete(`/pessoas/${id}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao deletar usuário');
        }
    }
}

export const usuarioService = new UsuarioService();