import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritosProvider } from './context/FavoritosContext';
import { ToastProvider } from './context/ToastContext';
import { CarrinhoProvider } from './context/CarrinhoContext';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import AppRoutes from './routes';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <FavoritosProvider>
            <CarrinhoProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </CarrinhoProvider>
          </FavoritosProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;