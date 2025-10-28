import { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';

export function UseAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        setLoading(true);
        
        try {
            const token = sessionStorage.getItem("token");
            const userData = sessionStorage.getItem("userData");

            if (!token || !userData) {
                setLoading(false);
                return;
            }

            // Verificar se token não expirou
            if (authService.isTokenExpired(token)) {
                logout();
                return;
            }
            
            // Tentar verificar token
            const verifiedUser = await authService.verificarToken();
            setUser(verifiedUser);
            
        } catch (error) {
            console.error("Erro na verificação de autenticação:", error.message);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, senha) => {
        try {
            const response = await authService.login(email, senha);

            // Salvar dados no sessionStorage
            sessionStorage.setItem("token", response.token);
            sessionStorage.setItem("userData", JSON.stringify(response.user));
            
            if (response.expiresIn) {
                const expiryTime = Date.now() + (response.expiresIn * 1000);
                sessionStorage.setItem("tokenExpiry", expiryTime.toString());
            }

            setUser(response.user);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.clearAuthData();
        setUser(null);
        
        // Recarregar a página apenas se não estivermos já na home
        if (window.location.pathname !== '/') {
            window.location.href = '/';
        }
    };

    const updateUser = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        sessionStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const isAuthenticated = () => {
        const token = sessionStorage.getItem("token");
        
        if (!token || !user) {
            return false;
        }
        
        // Verificar se token não expirou
        if (authService.isTokenExpired(token)) {
            logout();
            return false;
        }
        
        return true;
    };

    const getToken = () => {
        const token = sessionStorage.getItem("token");
        
        if (token && authService.isTokenExpired(token)) {
            logout();
            return null;
        }
        
        return token;
    };

    const refreshToken = async () => {
        try {
            const response = await authService.refreshToken();
            sessionStorage.setItem("token", response.token);
            sessionStorage.setItem("tokenExpiry", (Date.now() + (response.expiresIn * 1000)).toString());
            return response;
        } catch (error) {
            logout();
            throw error;
        }
    };

    return {
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated,
        getToken,
        refreshToken,
        checkAuthStatus
    };
}