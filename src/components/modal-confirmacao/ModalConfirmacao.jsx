import './ModalConfirmacao.css';

export function ModalConfirmacao({
  isOpen,
  onClose,
  onConfirm,
  titulo = "Confirmar ação",
  mensagem = "Tem certeza que deseja continuar?",
  textoBotaoConfirmar = "Confirmar",
  textoBotaoCancelar = "Cancelar",
  tipo = "default", // "default", "danger", "warning", "success"
  icone = null,
  loading = false,
  children = null // Para conteúdo customizado
}) {
  
  const getIconeByTipo = () => {
    if (icone) return icone;
    
    switch (tipo) {
      case "danger":
        return "bi bi-exclamation-triangle";
      case "warning":
        return "bi bi-exclamation-circle";
      case "success":
        return "bi bi-check-circle";
      default:
        return "bi bi-question-circle";
    }
  };

  const getClasseByTipo = () => {
    switch (tipo) {
      case "danger":
        return "modal-danger";
      case "warning":
        return "modal-warning";
      case "success":
        return "modal-success";
      default:
        return "modal-default";
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <div className="modal-confirmacao-overlay" onClick={handleOverlayClick}>
      <div className={`modal-confirmacao ${getClasseByTipo()}`}>
        <div className="modal-confirmacao-header">
          <div className="modal-confirmacao-icone">
            <i className={getIconeByTipo()}></i>
          </div>
          <button 
            className="modal-confirmacao-close"
            onClick={handleClose}
            disabled={loading}
            aria-label="Fechar modal"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className="modal-confirmacao-body">
          <h3 className="modal-confirmacao-titulo">{titulo}</h3>
          
          {children ? (
            <div className="modal-confirmacao-conteudo">
              {children}
            </div>
          ) : (
            <p className="modal-confirmacao-mensagem">{mensagem}</p>
          )}
        </div>

        <div className="modal-confirmacao-footer">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="btn-cancelar"
          >
            {textoBotaoCancelar}
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`btn-confirmar btn-${tipo}`}
          >
            {loading ? (
              <>
                <div className="button-spinner"></div>
                Processando...
              </>
            ) : (
              textoBotaoConfirmar
            )}
          </button>
        </div>
      </div>
    </div>
  );
}