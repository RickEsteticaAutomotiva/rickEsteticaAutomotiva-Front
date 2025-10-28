import './LoadingState.css';

export function LoadingState({
  message = "Carregando..."
}) {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
}