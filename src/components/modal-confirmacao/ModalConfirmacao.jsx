export function ModalConfirmacao({
  isOpen,
  onClose,
  onConfirm,
  titulo = "Confirmar ação",
  mensagem = "Tem certeza que deseja continuar?",
  textoBotaoConfirmar = "Confirmar",
  textoBotaoCancelar = "Cancelar",
  tipo = "default",
  icone = null,
  loading = false,
  hideCancelButton = false,
  children = null
}) {

  const getIconeByTipo = () => {
    if (icone) return icone;
    switch (tipo) {
      case "danger":  return "bi bi-exclamation-triangle";
      case "warning": return "bi bi-exclamation-circle";
      case "success": return "bi bi-check-circle";
      default:        return "bi bi-question-circle";
    }
  };

  const iconeWrapperClass = () => {
    switch (tipo) {
      case "danger":  return "bg-red-50 text-red-500";
      case "warning": return "bg-amber-50 text-amber-500";
      case "success": return "bg-green-50 text-green-500";
      default:        return "bg-blue-50 text-blue-500";
    }
  };

  const confirmBtnClass = () => {
    const base = "flex-1 border-none px-6 py-3.5 rounded-lg font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0";
    switch (tipo) {
      case "danger":  return `${base} bg-red-600 text-white hover:bg-red-700`;
      case "warning": return `${base} bg-amber-500 text-white hover:bg-amber-600`;
      case "success": return `${base} bg-green-600 text-white hover:bg-green-700`;
      default:        return `${base} bg-blue-600 text-white hover:bg-blue-700`;
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) onClose();
  };

  const handleConfirm = () => { if (!loading) onConfirm(); };
  const handleClose   = () => { if (!loading) onClose(); };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-2 sm:p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto animate-[modal-slide-in_0.3s_ease-out]">

        {/* Cabeçalho */}
        <div className="relative flex justify-center px-6 pt-8 pb-4">
          <div className={`flex items-center justify-center w-20 h-20 rounded-full mx-auto text-4xl ${iconeWrapperClass()}`}>
            <i className={getIconeByTipo()}></i>
          </div>
          <button
            className="absolute top-4 right-4 bg-transparent border-none text-2xl text-gray-500 cursor-pointer p-2 rounded-lg flex items-center justify-center w-10 h-10 transition-all hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            onClick={handleClose}
            disabled={loading}
            aria-label="Fechar modal"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        {/* Corpo */}
        <div className="px-6 pb-6 text-center">
          <h3 className="text-xl font-bold mb-4 text-gray-800">{titulo}</h3>
          {children ? (
            <div>{children}</div>
          ) : (
            <p className="text-base text-gray-500 leading-relaxed">{mensagem}</p>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex flex-col sm:flex-row gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          {!hideCancelButton && (
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-white text-gray-500 border-2 border-gray-200 px-6 py-3.5 rounded-lg font-semibold cursor-pointer transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              {textoBotaoCancelar}
            </button>
          )}
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={confirmBtnClass()}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin"></div>
                Processando...
              </>
            ) : textoBotaoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}