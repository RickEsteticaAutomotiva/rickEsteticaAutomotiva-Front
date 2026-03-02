import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritosProvider } from './context/FavoritosContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import AppRoutes from './routes';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <FavoritosProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </FavoritosProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;