import { Component } from 'react';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary capturou um erro:', error, info);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    gap: '1rem',
                    fontFamily: 'sans-serif',
                    color: '#333'
                }}>
                    <h2>Algo deu errado.</h2>
                    <p>Recarregue a página para tentar novamente.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ padding: '0.5rem 1.5rem', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ccc' }}
                    >
                        Recarregar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
