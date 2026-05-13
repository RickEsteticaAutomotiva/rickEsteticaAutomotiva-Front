import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/Routes';
import { LoadingState } from '../components/loading-state/LoadingState';

export function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <LoadingState />;
    if (!isAuthenticated()) return <Navigate to={ROUTES.LOGIN} replace />;
    return children;
}

/**
 * Protege rotas do gerente — exige autenticação E role de gerente.
 */
export function GerenteRoute({ children }) {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) return <LoadingState />;
    if (!isAuthenticated()) return <Navigate to={ROUTES.LOGIN} replace />;
    if (!user?.roles?.includes('ROLE_GERENTE')) return <Navigate to={ROUTES.HOME} replace />;
    return children;
}
