import { config } from "../config.js";

export async function login(email, senha) {
    try {
        const response = await fetch(`${config.api_url}/pessoas`, {
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

export async function cadastrar(nome, cpf, email, telefone, senha) {
    console.log(JSON.stringify({ nome, cpf, email, telefone, senha }));

    try {
        const response = await fetch(`${config.api_url}/pessoas/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, cpf, email, telefone, senha })
        });

        if (response.headers.get("content-length") === "0" || response.status === 204) {
            return undefined;
        }

        return await response.ok();
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
    }
}