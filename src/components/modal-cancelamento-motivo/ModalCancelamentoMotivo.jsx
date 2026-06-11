import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MotivosCancelamento } from '../../utils/enum/MotivosCancelamento';

export function ModalCancelamentoMotivo({
  isOpen,
  onClose,
  onConfirm,
  loading = false
}) {
  const [motivoSelecionado, setMotivoSelecionado] = useState('');
  const [observacaoOutro, setObservacaoOutro] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setMotivoSelecionado('');
      setObservacaoOutro('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!motivoSelecionado) {
      return;
    }

    const motivo = {
      id: Number(motivoSelecionado),
      observacao: motivoSelecionado === String(MotivosCancelamento.OUTROS.id) ? observacaoOutro : ''
    };

    onConfirm(motivo);
  };

  const isOutrosSelected = motivoSelecionado === String(MotivosCancelamento.OUTROS.id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">
            <i className="bi bi-exclamation-triangle text-red-600 mr-2" aria-hidden="true"></i>
            Motivo do Cancelamento
          </h3>
          <button
            className="bg-transparent border-none text-2xl text-gray-500 cursor-pointer p-2 rounded-lg flex items-center justify-center w-10 h-10 transition-all hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
            aria-label="Fechar modal"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        {/* Corpo */}
        <div className="px-6 py-6 space-y-4">
          <div>
            <label htmlFor="motivo-select" className="text-sm font-medium text-gray-700 block mb-3">
              Selecione um motivo
            </label>
            <select
              id="motivo-select"
              value={motivoSelecionado}
              onChange={(e) => setMotivoSelecionado(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-800 font-medium transition-all hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">-- Selecione --</option>
              {Object.values(MotivosCancelamento).map((motivo) => (
                <option key={motivo.id} value={motivo.id}>
                  {motivo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Campo de texto opcional para "Outros" */}
          {isOutrosSelected && (
            <div className="animate-[fade-in-up_0.3s_ease-out]">
              <label htmlFor="observacao-outro" className="text-sm font-medium text-gray-700 block mb-2">
                Descreva o motivo (opcional)
              </label>
              <textarea
                id="observacao-outro"
                value={observacaoOutro}
                onChange={(e) => setObservacaoOutro(e.target.value)}
                disabled={loading}
                placeholder="Explique brevemente o motivo do cancelamento..."
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700 font-medium transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                {observacaoOutro.length}/500 caracteres
              </p>
            </div>
          )}

          {/* Aviso */}
          <div
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-700 flex items-center gap-2">
              <i className="bi bi-exclamation-triangle flex-shrink-0" aria-hidden="true"></i>
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-white text-gray-600 border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || !motivoSelecionado}
            className="flex-1 bg-red-600 text-white border-2 border-red-600 px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all hover:bg-red-700 hover:border-red-700 disabled:bg-gray-300 disabled:border-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                Cancelando...
              </>
            ) : (
              <>
                <i className="bi bi-x-circle" aria-hidden="true"></i>
                Confirmar Cancelamento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

ModalCancelamentoMotivo.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool
};
