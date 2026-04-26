import React from 'react';
import { Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { formatarPreco } from '../../../../utils/formatacao/dinheiro';

const CardServico = ({ servico, onEditar, onExcluir }) => {
  if (!servico || !servico.id) {
    return null;
  }

  const temImagem = servico.imagem || servico.imagemUrl;

  const obterDuracao = () => {
    if (servico.duracaoHoras) {
      const partes = servico.duracaoHoras.split(':');
      const horas = parseInt(partes[0], 10);
      const minutos = parseInt(partes[1], 10);
      return horas * 60 + minutos;
    }
    return servico.duracao || servico.tempo;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {temImagem ? (
          <img
            src={temImagem}
            alt={servico.nome || 'Serviço'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              const sibling = e.target.nextElementSibling;
              if (sibling) {
                sibling.style.display = 'flex';
              }
            }}
          />
        ) : null}
        {!temImagem && (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageIcon size={40} />
            <span className="text-sm mt-2">Sem imagem</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {servico.categoriaNome && (
          <span className="inline-block bg-red-50 text-[#B30000] text-xs font-semibold px-3 py-1 rounded-full mb-2">
            {servico.categoriaNome}
          </span>
        )}

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {servico.nome || 'Sem nome'}
        </h3>

        {servico.descricao && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {servico.descricao}
          </p>
        )}

        <div className="mb-4 p-3 bg-red-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Preço</p>
          <p className="text-2xl font-bold text-[#B30000]">
            {formatarPreco(servico.preco ?? servico.precoBase ?? 0)}
          </p>
        </div>

        {obterDuracao() && (
          <div className="text-xs text-gray-500 mb-4">
            <span className="inline-block">
              ⏱ {obterDuracao()} min
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onEditar}
            type="button"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition-colors font-semibold cursor-pointer"
          >
            <Edit2 size={16} />
            Editar
          </button>
          <button
            onClick={onExcluir}
            type="button"
            className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition-colors font-semibold cursor-pointer"
          >
            <Trash2 size={16} />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardServico;
