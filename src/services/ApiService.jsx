import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor para adicionar token automaticamente
        this.api.interceptors.request.use(
            (config) => {
                const token = sessionStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
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
                
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    
                    try {
                        // Tentar renovar o token
                        const { authService } = await import('./AuthService');
                        const response = await authService.refreshToken();
                        
                        sessionStorage.setItem('token', response.token);
                        originalRequest.headers.Authorization = `Bearer ${response.token}`;
                        
                        return this.api(originalRequest);
                    } catch (refreshError) {
                        // Se não conseguir renovar, fazer logout
                        sessionStorage.clear();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }
                
                if (error.response) {
                    const { status, data } = error.response;
                    
                    switch (status) {
                        case 401:
                            sessionStorage.clear();
                            window.location.href = '/login';
                            break;
                        case 403:
                            throw new Error('Acesso negado');
                        case 404:
                            throw new Error('Recurso não encontrado');
                        case 500:
                            throw new Error('Erro interno do servidor');
                        default:
                            throw new Error(data?.message || 'Erro na requisição');
                    }
                } else if (error.request) {
                    throw new Error('Erro de conexão com o servidor');
                } else {
                    throw new Error('Erro inesperado');
                }
                
                return Promise.reject(error);
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