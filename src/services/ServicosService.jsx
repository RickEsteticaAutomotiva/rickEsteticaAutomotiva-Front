import { apiService } from './ApiService';

export class ServicosService {
    async buscarTodos(filtros = {}) {
        try {
            const response = await apiService.getWithParams('/servicos', filtros);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar serviços');
        }
    }

    async buscarPorId(id) {
        try {
            const response = await apiService.get(`/servicos/${id}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar serviço');
        }
    }

    async buscarPorCategoria(categoria, filtros = {}) {
        try {
            const response = await apiService.getWithParams(`/servicos/categoria/${categoria}`, filtros);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao buscar serviços por categoria');
        }
    }

    async pesquisar(termo, filtros = {}) {
        try {
            const params = { q: termo, ...filtros };
            const response = await apiService.getWithParams('/servicos/busca', params);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao pesquisar serviços');
        }
    }

    async criarServico(servicoData) {
        try {
            const response = await apiService.post('/servicos', servicoData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao criar serviço');
        }
    }

    async atualizarServico(id, servicoData) {
        try {
            const response = await apiService.put(`/servicos/${id}`, servicoData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao atualizar serviço');
        }
    }

    async excluirServico(id) {
        try {
            const response = await apiService.delete(`/servicos/${id}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao excluir serviço');
        }
    }

    async uploadImagemServico(servicoId, arquivo) {
        try {
            const response = await apiService.uploadFile(`/servicos/${servicoId}/imagem`, arquivo);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao fazer upload da imagem');
        }
    }
}

export const servicosService = new ServicosService();