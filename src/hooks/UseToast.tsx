import { useState, useCallback } from 'react';

export function UseToast() {
    const [toasts, setToasts] = useState([]);

    const mostrarToast = useCallback(({ 
        tipo = 'info', 
        titulo, 
        subtitulo, 
        mensagem, 
        duracao = 3000 
    }) => {
        const id = Date.now() + Math.random();
        const novoToast = {
            id,
            tipo,
            titulo,
            subtitulo,
            mensagem,
            duracao
        };

        setToasts(anterior => [...anterior, novoToast]);

        return id;
    }, []);

    const fecharToast = useCallback((id) => {
        setToasts(anterior => anterior.filter(toast => toast.id !== id));
    }, []);

    return {
        toasts,
        mostrarToast,
        fecharToast
    };
}