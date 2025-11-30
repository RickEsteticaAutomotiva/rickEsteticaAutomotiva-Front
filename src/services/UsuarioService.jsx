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
            const response = await apiService.patch(`/pessoas/${id}`, dadosAtualizados);
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

    async alterarSenha(userId, senhaData) {
        try {
            const response = await apiService.patch(`/pessoas/senha/${userId}`, senhaData);
            return response;
        } catch (error) {
            throw new Error('Erro ao alterar senha. Verifique a senha atual.');
        }
    }
}

export const usuarioService = new UsuarioService();