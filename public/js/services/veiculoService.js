import { config } from "../config.js";

export async function cadastrar(veiculo) {
    try {
        const response = await fetch(`${config.json_api_url}/veiculos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(veiculo)
        });

        if (response.headers.get("content-length") === "0" || response.status === 204) {
            return undefined;
        }

        return response.ok;
    } catch (error) {
        console.error('Erro ao cadastrar veículo:', error);
    }
}

export async function listarByCliente(clienteId) {
    try {
        const response = await fetch(`${config.json_api_url}/veiculos?clienteId=${clienteId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.headers.get("content-length") === "0" || response.status === 204) {
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao listar veículos:', error);
    }
}

export async function deletar(veiculoId) {
    try {
        const response = await fetch(`${config.json_api_url}/veiculos/${veiculoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.ok;
    } catch (error) {
        console.error('Erro ao deletar veículo:', error);
    }
}

export async function atualizar(veiculoId, veiculo) {
    try {
        const response = await fetch(`${config.json_api_url}/veiculos/${veiculoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(veiculo)
        });

        if (response.headers.get("content-length") === "0" || response.status === 204) {
            return undefined;
        }

        return response.ok;
    } catch (error) {
        console.error('Erro ao atualizar veículo:', error);
    }
}