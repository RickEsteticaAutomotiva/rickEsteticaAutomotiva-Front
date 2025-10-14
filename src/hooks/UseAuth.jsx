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
        const token = sessionStorage.getItem("token");

        if (token) {
            try {
                // Verificar se token ainda é válido
                if (authService.isTokenExpired && authService.isTokenExpired(token)) {
                    logout();
                    return;
                }
                
                const userData = await authService.verificarToken();
                setUser(userData);
            } catch (error) {
                console.error("Token inválido:", error);
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (email, senha) => {
        try {
            const response = await authService.login(email, senha);

            sessionStorage.setItem("token", response.token);
            sessionStorage.setItem("userData", JSON.stringify(response.user));
            sessionStorage.setItem("tokenExpiry", (Date.now() + (response.expiresIn * 1000)).toString());

            setUser(response.user);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
            sessionStorage.clear();
            setUser(null);
            window.location.reload();
    };

    const updateUser = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        sessionStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const isAuthenticated = () => {
        const token = sessionStorage.getItem("token");
        const tokenExpiry = sessionStorage.getItem("tokenExpiry");
        
        if (!token || !user) return false;
        
        // Verificar se token não expirou
        if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
            logout();
            return false;
        }
        
        return true;
    };

    const getToken = () => {
        return sessionStorage.getItem("token");
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