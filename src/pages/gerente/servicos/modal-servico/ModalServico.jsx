import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useToast as useToastContext } from '../../../../context/ToastContext';
import { servicosService } from '../../../../services/ServicosService';
import UploadImagem from '../upload-imagem/UploadImagem';

const ModalServico = ({ isOpen, onClose, modo, servico, onSuccess, categorias }) => {
  const { mostrarToast } = useToastContext();
  
  const mostrarNotificacao = (tipo, mensagem) => {
    try {
      mostrarToast?.({ tipo, mensagem });
    } catch (e) {
      console.error('Erro ao mostrar notificação:', e);
    }
  };

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    duracao: '',
    imagem: null,
  });

  const [imagemPreview, setImagemPreview] = useState(null);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    try {
      if (modo === 'editar' && servico) {
        let duracao = '';
        if (servico.duracaoHoras) {
          const partes = servico.duracaoHoras.split(':');
          const horas = parseInt(partes[0], 10);
          const minutos = parseInt(partes[1], 10);
          duracao = (horas * 60 + minutos).toString();
        } else if (servico.duracao) {
          duracao = servico.duracao;
        }

        setFormData({
          nome: servico.nome || '',
          descricao: servico.descricao || '',
          preco: servico.preco || '',
          categoria: servico.categoriaNome || servico.categoria || '',
          duracao: duracao,
          imagem: null,
        });
        
        if (servico.imagem || servico.imagemUrl) {
          setImagemPreview(servico.imagem || servico.imagemUrl);
        }
      } else {
        resetarFormulario();
      }
    } catch (erro) {
      console.error('Erro ao inicializar formulário:', erro);
      resetarFormulario();
    }
  }, [modo, servico, isOpen]);

  const resetarFormulario = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      categoria: '',
      duracao: '',
      imagem: null,
    });
    setImagemPreview(null);
    setErros({});
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome do serviço é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
    } else if (formData.nome.trim().length > 50) {
      novosErros.nome = 'Nome não pode exceder 50 caracteres';
    }

    if (formData.descricao && formData.descricao.length > 255) {
      novosErros.descricao = 'Descrição não pode exceder 255 caracteres';
    }

    if (!formData.preco) {
      novosErros.preco = 'Preço é obrigatório';
    } else if (Number.parseFloat(formData.preco) < 0) {
      novosErros.preco = 'Preço não pode ser negativo';
    }

    if (!formData.categoria) {
      novosErros.categoria = 'Categoria é obrigatória';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (erros[name]) {
      setErros(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImagemSelecionada = (arquivo) => {
    setFormData(prev => ({
      ...prev,
      imagem: arquivo
    }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagemPreview(reader.result);
    };
    reader.readAsDataURL(arquivo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      mostrarNotificacao('AVISO', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setSalvando(true);

      const categoriaObj = categorias?.find(cat => 
        (cat?.nome || cat) === formData.categoria
      );
      const categoriaId = categoriaObj?.id || null;

      let duracaoHoras = null;
      if (formData.duracao) {
        const minutos = Number.parseInt(formData.duracao, 10);
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        duracaoHoras = `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
      }

      const dadosEnvio = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim(),
        preco: Number.parseFloat(formData.preco),
        categoriaId: categoriaId,
      };

      if (duracaoHoras) {
        dadosEnvio.duracaoHoras = duracaoHoras;
      }

      let resposta;

      if (modo === 'criar') {
        resposta = await servicosService.criarServico(dadosEnvio);
      } else {
        resposta = await servicosService.atualizarServico(servico.id, dadosEnvio);
      }

      if (formData.imagem && resposta.id) {
        try {
          await servicosService.uploadImagemServico(resposta.id || servico.id, formData.imagem);
        } catch (erro) {
          mostrarNotificacao('AVISO', 'Serviço salvo, mas houve erro no upload da imagem');
        }
      }

      mostrarNotificacao(
        'SUCESSO',
        modo === 'criar' ? 'Serviço criado com sucesso!' : 'Serviço atualizado com sucesso!'
      );
      resetarFormulario();
      onSuccess();
    } catch (erro) {
      let mensagem = modo === 'criar' ? 'Erro ao criar serviço' : 'Erro ao atualizar serviço';
      
      if (erro.response?.status === 400 && erro.response?.data?.campos) {
        const campos = erro.response.data.campos;
        if (Array.isArray(campos) && campos.length > 0) {
          mensagem = `Validação: ${campos[0]}`;
        }
      }
      
      mostrarNotificacao('ERRO', mensagem);
    } finally {
      setSalvando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in">
        <div className="sticky top-0 bg-gradient-to-r from-[#B30000] to-red-600 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">
            {modo === 'criar' ? 'Novo Serviço' : 'Editar Serviço'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Imagem do Serviço</h3>
            <UploadImagem
              imagemAtual={imagemPreview}
              onImagemSelecionada={handleImagemSelecionada}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Informações Básicas</h3>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Nome do Serviço *
                </label>
                <span className={`text-xs ${
                  formData.nome.length > 50
                    ? 'text-red-500 font-semibold'
                    : 'text-gray-500'
                }`}>
                  {formData.nome.length}/50
                </span>
              </div>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Ex: Lavagem Completa"
                maxLength={50}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  erros.nome
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-red-500'
                }`}
              />
              {erros.nome && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {erros.nome}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descreva o serviço em detalhes..."
                maxLength={500}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.descricao.length}/500 caracteres
              </p>
            </div>
          </div>


          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Preço</h3>

            <div>
              <input
                type="number"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                placeholder="0,00"
                step="0.01"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  erros.preco
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-red-500'
                }`}
              />
              {erros.preco && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {erros.preco}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Categoria</h3>

            <div>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                disabled={!categorias || categorias.length === 0}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  !categorias || categorias.length === 0
                    ? 'bg-gray-100 cursor-not-allowed'
                    : ''
                } ${
                  erros.categoria
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-red-500'
                }`}
              >
                <option value="">
                  {categorias && categorias.length > 0
                    ? 'Selecione uma categoria'
                    : 'Nenhuma categoria disponível'}
                </option>
                {categorias && categorias.length > 0 && categorias.map(cat => (
                  <option key={cat?.id || cat} value={cat?.nome || cat}>
                    {cat?.nome || cat}
                  </option>
                ))}
              </select>
              {erros.categoria && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {erros.categoria}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração (em minutos)
            </label>
            <input
              type="number"
              name="duracao"
              value={formData.duracao}
              onChange={handleChange}
              placeholder="Ex: 60"
              min="0"
              max="999"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 px-6 py-2 bg-[#B30000] hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {salvando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                modo === 'criar' ? 'Criar Serviço' : 'Atualizar Serviço'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalServico;
