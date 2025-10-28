import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            timeout: 10000, // 10 segundos de timeout
        });

        // Interceptor para adicionar token automaticamente
        this.api.interceptors.request.use(
            (config) => {
                const token = sessionStorage.getItem('token');
                
                // Endpoints públicos que não precisam de token (incluindo versões com barra)
                const isLoginRequest = config.url === '/pessoas/login';
                const isCadastroRequest = (config.url === '/pessoas' || config.url === '/pessoas/') && config.method === 'post';
                const isPublicEndpoint = isLoginRequest || isCadastroRequest;
                
                // Só adicionar token se:
                // 1. Token existe
                // 2. Não é um endpoint público
                // 3. Token não expirou
                if (token && !isPublicEndpoint) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        if (payload.exp && payload.exp < Date.now() / 1000) {
                            // Token expirado, limpar e não enviar
                            sessionStorage.clear();
                            return config;
                        }
                        
                        config.headers.Authorization = `Bearer ${token}`;
                    } catch (error) {
                        console.error('Erro ao validar token:', error);
                        // Se erro na validação, não adicionar token
                    }
                }
                
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Interceptor para tratar respostas e erros
        this.api.interceptors.response.use(
            (response) => {
                return response.data;
            },
            async (error) => {
                const originalRequest = error.config;
                
                if (error.response) {
                    const { status, data } = error.response;
                    
                    switch (status) {
                        case 401:
                            // Para login/cadastro, retornar erro específico
                            if (originalRequest.url?.includes('/login')) {
                                throw new Error(data?.message || 'Credenciais inválidas');
                            }
                            
                            if (originalRequest.url?.includes('/pessoas') && originalRequest.method === 'post') {
                                throw new Error(data?.message || 'Erro ao cadastrar usuário');
                            }
                            
                            // Para outras requisições, token expirado
                            if (!originalRequest._retry) {
                                originalRequest._retry = true;
                                
                                // Limpar dados de autenticação
                                sessionStorage.clear();
                                
                                // Redirecionar apenas se necessário
                                if (window.location.pathname !== '/login' && 
                                    window.location.pathname !== '/' &&
                                    window.location.pathname !== '/cadastrar') {
                                    window.location.href = '/login';
                                }
                            }
                            throw new Error('Sessão expirada. Faça login novamente.');
                            
                        case 403:
                            throw new Error('Acesso negado');
                            
                        case 404:
                            throw new Error('Recurso não encontrado');
                            
                        case 500:
                            throw new Error('Erro interno do servidor');
                            
                        default:
                            throw new Error(data?.message || `Erro ${status}`);
                    }
                } else if (error.request) {
                    throw new Error('Erro de conexão com o servidor');
                } else {
                    throw new Error('Erro inesperado');
                }
            }
        );
    }

    async get(endpoint, config = {}) {
        try {
            return await this.api.get(endpoint, config);
        } catch (error) {
            throw error;
        }
    }

    async post(endpoint, data = {}, config = {}) {
        try {
            return await this.api.post(endpoint, data, config);
        } catch (error) {
            throw error;
        }
    }

    async put(endpoint, data = {}, config = {}) {
        try {
            return await this.api.put(endpoint, data, config);
        } catch (error) {
            throw error;
        }
    }

    async patch(endpoint, data = {}, config = {}) {
        try {
            return await this.api.patch(endpoint, data, config);
        } catch (error) {
            throw error;
        }
    }

    async delete(endpoint, config = {}) {
        try {
            return await this.api.delete(endpoint, config);
        } catch (error) {
            throw error;
        }
    }

    // Método para upload de arquivos
    async uploadFile(endpoint, file, onUploadProgress = null) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            return await this.api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress,
            });
        } catch (error) {
            throw error;
        }
    }

    // Método para requisições com parâmetros de query
    async getWithParams(endpoint, params = {}) {
        try {
            return await this.api.get(endpoint, { params });
        } catch (error) {
            throw error;
        }
    }
}

export const apiService = new ApiService();