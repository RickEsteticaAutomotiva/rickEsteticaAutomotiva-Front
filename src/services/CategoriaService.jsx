import { apiService } from "./ApiService";

export class CategoriaService {
    async buscarTodas() {
        const response = await apiService.get("/categorias");
        return response;
    }

    async criarCategoria(categoria) {
        const response = await apiService.post("/categorias", categoria);
        return response;
    }

    async atualizarCategoria(id, categoria) {
        const response = await apiService.put(`/categorias/${id}`, categoria);
        return response;
    }

    // async removerCategoria(id) {
    //     const response = await apiService.delete(`/categorias/${id}`);
    //     return response;
    // }
}
