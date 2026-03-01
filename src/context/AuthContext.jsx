import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/AuthService';
import { ROUTES } from '../constants/Routes';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const logout = useCallback(() => {
        authService.clearAuthData();
        setUser(null);
        navigate(ROUTES.HOME, { replace: true });
    }, [navigate]);

    // Escuta eventos de sessão expirada disparados pelo ApiService interceptor
    useEffect(() => {
        const handleUnauthorized = () => {
            authService.clearAuthData();
            setUser(null);
            navigate(ROUTES.LOGIN, { replace: true });
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [navigate]);

    useEffect(() => {
        checkAuthStatus();
         
    }, []);

    const checkAuthStatus = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const userData = sessionStorage.getItem('userData');

            if (!token || !userData) {
                return;
            }

            if (authService.isTokenExpired(token)) {
                authService.clearAuthData();
                setUser(null);
                return;
            }

            const verifiedUser = await authService.verificarToken();
            setUser(verifiedUser);
        } catch (error) {
            console.error('Erro na verificação de autenticação:', error.message);
            authService.clearAuthData();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, senha) => {
        const response = await authService.login(email, senha);
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('userData', JSON.stringify(response.user));
        if (response.expiresIn) {
            sessionStorage.setItem('tokenExpiry', (Date.now() + response.expiresIn * 1000).toString());
        }
        setUser(response.user);
        return response;
    };

    const updateUser = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        sessionStorage.setItem('userData', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const hasRole = useCallback((role) => {
        return user?.roles?.includes(role) ?? false;
    }, [user]);

    const isAuthenticated = useCallback(() => {
        const token = sessionStorage.getItem('token');
        if (!token) return false;
        if (authService.isTokenExpired(token)) {
            authService.clearAuthData();
            setUser(null);
            return false;
        }
        return true;
    }, []);

    const getToken = () => {
        const token = sessionStorage.getItem('token');
        if (token && authService.isTokenExpired(token)) {
            logout();
            return null;
        }
        return token;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAuthenticated, hasRole, getToken, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
}
