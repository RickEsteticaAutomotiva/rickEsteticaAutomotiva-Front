import { apiService } from './ApiService';

export class UsuarioService {
    async obterPerfil(id) {
        try {
            const response = await apiService.get('/usuario/' + id);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao obter informações do usuário');
        }
    }
}

export const usuarioService = new UsuarioService();