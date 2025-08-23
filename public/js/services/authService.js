import { config } from "../config.js";

export async function login(email, senha) {
    try {
        const response = await fetch(`${config.api_url}/usuario/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (response.headers.get("content-length") === "0" || response.status === 204) {
            return undefined;
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao fazer login:', error);
    }
}

export async function cadastrar(email, senha) {
    try {
        const response = await fetch(`${config.api_url}/usuario/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        if (response.headers.get("content-length") === "0" || response.status === 204) {
            return undefined;
        }

        return await response.ok;
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
    }
}