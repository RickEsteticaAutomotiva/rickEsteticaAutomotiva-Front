import { createContext, useContext, useState, useCallback } from 'react';
import { ContainerToast } from '../components/toast/ContainerToast';

const ToastContext = createContext(null);

/**
 * Provider global de toasts.
 * Adicione <ToastProvider> uma única vez no App e use o hook
 * useToast() em qualquer componente para disparar notificações.
 */
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const mostrarToast = useCallback(({ tipo = 'info', titulo, subtitulo, mensagem, duracao = 3000 }) => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, tipo, titulo, subtitulo, mensagem, duracao }]);
        return id;
    }, []);

    const fecharToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ mostrarToast, fecharToast }}>
            {children}
            <ContainerToast toasts={toasts} aoFechar={fecharToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast deve ser usado dentro de ToastProvider');
    }
    return context;
}
