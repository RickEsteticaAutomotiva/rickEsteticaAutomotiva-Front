import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const UploadImagem = ({ imagemAtual, onImagemSelecionada }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = (e) => {
    try {
      const arquivo = e.target?.files?.[0];
      if (arquivo) {
        // Valida tipo de arquivo
        if (!arquivo.type.startsWith('image/')) {
          alert('Por favor, selecione um arquivo de imagem');
          return;
        }

        // Valida tamanho (máx 5MB)
        if (arquivo.size > 5 * 1024 * 1024) {
          alert('A imagem deve ter menos de 5MB');
          return;
        }

        onImagemSelecionada(arquivo);
      }

      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      if (e.target) {
        e.target.value = '';
      }
    } catch (erro) {
      alert('Erro ao processar a imagem');
    }
  };

  const handleRemover = (e) => {
    e.stopPropagation();
    onImagemSelecionada(null);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#B30000] hover:bg-red-50 transition-colors flex items-center justify-center group"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {imagemAtual ? (
        <>
          <img
            src={imagemAtual}
            alt="Preview"
            className="w-full h-full object-cover rounded-md"
          />
          <button
            onClick={handleRemover}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={20} />
          </button>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-md transition-colors flex items-center justify-center">
            <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Clique para trocar
            </span>
          </div>
        </>
      ) : (
        <div className="text-center">
          <Upload className="mx-auto text-gray-400 mb-2" size={40} />
          <p className="text-gray-700 font-semibold">Clique para fazer upload</p>
          <p className="text-gray-500 text-sm">ou arraste uma imagem</p>
          <p className="text-gray-400 text-xs mt-2">PNG, JPG, GIF (máx 5MB)</p>
        </div>
      )}
    </div>
  );
};

export default UploadImagem;
