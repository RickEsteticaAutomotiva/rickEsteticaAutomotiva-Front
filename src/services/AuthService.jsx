import { apiService } from './ApiService';

export class AuthService {
    async login(email, senha) {
        try {
            const response = await apiService.post('/pessoas/login', { email, senha });
            
            // Simulação temporária até a API implementar JWT
            if (response && !response.token) {
                // Simular token JWT para desenvolvimento
                const mockToken = this.generateMockJWT(response);
                return {
                    token: mockToken,
                    user: response,
                    expiresIn: 3600 // 1 hora em segundos
                };
            }
            
            // Quando a API retornar token real, usar diretamente
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao fazer login');
        }
    }

    async cadastrar(userData) {
        try {
            const response = await apiService.post('/pessoas', userData);
            
            // Simulação temporária - após cadastro, fazer login automático
            if (response && !response.token) {
                const mockToken = this.generateMockJWT(response);
                return {
                    token: mockToken,
                    user: response,
                    expiresIn: 3600
                };
            }
            
            return response;
        } catch (error) {
            throw new Error(error.message || 'Erro ao cadastrar');
        }
    }

    async verificarToken() {
        try {
            const response = await apiService.get('/auth/verify');
            return response;
        } catch (error) {
            // Se não existir endpoint ainda, simular verificação local
            const token = sessionStorage.getItem('token');
            const userData = sessionStorage.getItem('userData');
            
            if (token && userData) {
                const user = JSON.parse(userData);
                // Verificar se token não expirou (simulação)
                const tokenData = this.decodeToken(token);
                if (tokenData && tokenData.exp > Date.now() / 1000) {
                    return user;
                }
            }
            throw new Error('Token inválido ou expirado');
        }
    }

    async refreshToken() {
        try {
            const response = await apiService.post('/auth/refresh');
            return response;
        } catch (error) {
            throw new Error('Erro ao renovar token');
        }
    }

    // Métodos auxiliares para simulação (remover quando API implementar JWT)
    generateMockJWT(userData) {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            sub: userData.id,
            email: userData.email,
            nome: userData.nome,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600 // 1 hora
        }));
        const signature = btoa('mock-signature-' + Math.random());
        
        return `${header}.${payload}.${signature}`;
    }

    decodeToken(token) {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch {
            return null;
        }
    }

    isTokenExpired(token) {
        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp) return true;
        return decoded.exp < Date.now() / 1000;
    }
}

export const authService = new AuthService();