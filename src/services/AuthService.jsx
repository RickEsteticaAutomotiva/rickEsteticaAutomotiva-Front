import { apiService } from './ApiService';

export class AuthService {
    async login(email, senha) {
        try {            
            // Garantir que os dados estão no formato correto
            const loginData = {
                email: email.trim(),
                senha: senha
            };
                        
            const response = await apiService.post('/pessoas/login', loginData);
            
            
            if (response && response.token) {
                const userData = {
                    id: response.userId,
                    email: response.email,
                    // nome: response.nome,
                };
                
                return {
                    token: response.token,
                    user: userData,
                    expiresIn: this.getTokenExpirationTime(response.token)
                };
            }
            
            throw new Error('Token não encontrado na resposta');
        } catch (error) {
            console.error('Erro no login:', error);
            throw new Error(error.message || 'Erro ao fazer login');
        }
    }

    async cadastrar(userData) {
        try {
            // MUDANÇA: Adicionar barra no final da URL
            const response = await apiService.post('/pessoas/', userData);
            
            // Se o backend retorna token após cadastro
            if (response && response.token) {
                const user = {
                    id: response.userId,
                    email: response.email,
                };
                
                return {
                    token: response.token,
                    user: user,
                    expiresIn: this.getTokenExpirationTime(response.token)
                };
            }
            
            // Se não retorna token, retornar apenas os dados do usuário
            return {
                user: response || userData
            };
        } catch (error) {
            throw new Error(error.message || 'Erro ao cadastrar');
        }
    }

    async verificarToken() {
        // Como o endpoint /auth/verify não existe, verificar localmente
        const token = sessionStorage.getItem('token');
        const userData = sessionStorage.getItem('userData');
        
        if (!token || !userData) {
            throw new Error('Token ou dados do usuário não encontrados');
        }

        try {
            const user = JSON.parse(userData);
            
            // Verificar se token não expirou
            if (this.isTokenExpired(token)) {
                throw new Error('Token expirado');
            }
            
            return user;
        } catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    }

    async refreshToken() {
        try {
            throw new Error('Token expirado, faça login novamente');
        } catch (error) {
            throw new Error('Erro ao renovar token');
        }
    }

    // Métodos auxiliares para JWT
    decodeToken(token) {
        try {
            if (!token || typeof token !== 'string') {
                return null;
            }
            
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }
            
            const payload = parts[1];
            return JSON.parse(atob(payload));
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return null;
        }
    }

    isTokenExpired(token) {
        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp) {
            return true;
        }
        return decoded.exp < Date.now() / 1000;
    }

    getTokenExpirationTime(token) {
        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp || !decoded.iat) {
            return 3600; // 1 hora como padrão
        }
        return decoded.exp - decoded.iat;
    }

    // Método para limpar dados de autenticação
    clearAuthData() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('tokenExpiry');
    }
}

export const authService = new AuthService();