import { useState, useEffect } from 'react';
import { veiculoService } from '../../services/VeiculoService';
import { UseAuth } from '../../hooks/UseAuth';
import { useToast } from '../../context/ToastContext';
import { TiposToast } from '../../utils/enum/TiposToast';
import { formatarPlacaCarro, isPlacaCarro } from '../../utils';

export function ModalVeiculo({ 
  isOpen, 
  onClose, 
  onSuccess, 
  veiculo = null, 
  modo = 'adicionar' // 'adicionar' ou 'editar'
}) {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
    placa: '',
    porte: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [marcas] = useState([
    'Chevrolet', 'Ford', 'Volkswagen', 'Fiat', 'Honda', 'Toyota', 
    'Hyundai', 'Nissan', 'Renault', 'Peugeot', 'Citroën', 'BMW', 
    'Mercedes-Benz', 'Audi', 'Volvo', 'Jeep', 'Mitsubishi', 'Outro'
  ]);
  
  const [cores] = useState([
    'Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul', 
    'Verde', 'Amarelo', 'Marrom', 'Bege', 'Dourado', 'Laranja', 'Outro'
  ]);
  
  const [portes] = useState([
    'Pequeno', 'Médio', 'Grande', 'SUV', 'Pickup', 'Van'
  ]);

  const { user } = UseAuth();
  const { mostrarToast } = useToast();

  useEffect(() => {
    if (veiculo && modo === 'editar') {
      setFormData({
        marca: veiculo.marca || '',
        modelo: veiculo.modelo || '',
        ano: veiculo.ano || '',
        cor: veiculo.cor || '',
        placa: veiculo.placa || '',
        porte: veiculo.porte || ''
      });
    } else {
      resetForm();
    }
  }, [veiculo, modo, isOpen]);

  const resetForm = () => {
    setFormData({
      marca: '',
      modelo: '',
      ano: '',
      cor: '',
      placa: '',
      porte: ''
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    // Validação da marca
    if (!formData.marca.trim()) {
      newErrors.marca = 'Marca é obrigatória';
    }

    // Validação do modelo
    if (!formData.modelo.trim()) {
      newErrors.modelo = 'Modelo é obrigatório';
    } else if (formData.modelo.trim().length < 2) {
      newErrors.modelo = 'Modelo deve ter pelo menos 2 caracteres';
    }

    // Validação do ano
    if (!formData.ano) {
      newErrors.ano = 'Ano é obrigatório';
    } else {
      const ano = parseInt(formData.ano);
      if (ano < 1900 || ano > currentYear + 1) {
        newErrors.ano = `Ano deve estar entre 1900 e ${currentYear + 1}`;
      }
    }

    // Validação da cor
    if (!formData.cor.trim()) {
      newErrors.cor = 'Cor é obrigatória';
    }

    // Validação da placa
    if (!formData.placa.trim()) {
      newErrors.placa = 'Placa é obrigatória';
    } else {
      const placa = formData.placa.replace(/[^a-zA-Z0-9]/g, '');
      if (placa.length !== 7) {
        newErrors.placa = 'Placa deve ter 7 caracteres';
      }

      if(isPlacaCarro(placa) === false) {
        newErrors.placa = 'Placa inválida';
      }
    }

    // Validação do porte
    if (!formData.porte.trim()) {
      newErrors.porte = 'Porte é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatação específica para cada campo
    if (name === 'placa') {
      formattedValue = formatarPlacaCarro(value);
    } else if (name === 'modelo') {
      formattedValue = value.replace(/[^a-zA-Z0-9\s\-]/g, '');
    } else if (name === 'ano') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Limpar erro do campo se existir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const dadosVeiculo = {
        id: modo === 'editar' ? veiculo.id : undefined,
        marca: formData.marca.trim(),
        modelo: formData.modelo.trim(),
        ano: parseInt(formData.ano),
        cor: formData.cor.trim(),
        placa: formData.placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
        porte: formData.porte.trim(),
        idPessoa: user.id
      };

      if (modo === 'editar') {
        await veiculoService.atualizarVeiculo(dadosVeiculo);
      } else {
        await veiculoService.adicionarVeiculo(dadosVeiculo);
      }

      onSuccess();
      onClose();
      resetForm();
      
    } catch (error) {
      mostrarToast({
        tipo: TiposToast.ERRO,
        titulo: 'Erro ao salvar veículo',
        mensagem: error.message || `Erro ao ${modo === 'editar' ? 'atualizar' : 'cadastrar'} veículo. Tente novamente.`,
        duracao: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      resetForm();
    }
  };

  if (!isOpen) return null;

  const inputClass = (field) =>
    `w-full py-3.5 px-4 border-2 rounded-lg text-base transition-all bg-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-[3px] focus:ring-red-600/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${
      errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-200'
    }`;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-2 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto animate-[modal-slide-in_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800 m-0 flex items-center">
            <i className="bi bi-car-front mr-2"></i>
            {modo === 'editar' ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
          </h2>
          <button
            className="bg-transparent border-none text-2xl text-gray-500 cursor-pointer p-2 rounded-lg transition-all w-10 h-10 flex items-center justify-center hover:bg-gray-100 hover:text-red-600 disabled:opacity-50"
            onClick={handleClose}
            disabled={loading}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {/* Marca + Modelo */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col flex-1">
              <label htmlFor="marca" className="font-semibold text-gray-700 mb-2 text-sm">Marca</label>
              <select id="marca" name="marca" value={formData.marca} onChange={handleInputChange} disabled={loading} className={inputClass('marca')} required>
                <option value="">Selecione a marca</option>
                {marcas.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {errors.marca && <span className="text-red-500 text-sm mt-1">{errors.marca}</span>}
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="modelo" className="font-semibold text-gray-700 mb-2 text-sm">Modelo</label>
              <input type="text" id="modelo" name="modelo" value={formData.modelo} onChange={handleInputChange} disabled={loading} className={inputClass('modelo')} placeholder="Ex: Civic, Corolla, Gol" maxLength={50} required />
              {errors.modelo && <span className="text-red-500 text-sm mt-1">{errors.modelo}</span>}
            </div>
          </div>

          {/* Ano + Cor */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col flex-1">
              <label htmlFor="ano" className="font-semibold text-gray-700 mb-2 text-sm">Ano</label>
              <input type="text" id="ano" name="ano" value={formData.ano} onChange={handleInputChange} disabled={loading} className={inputClass('ano')} placeholder="Ex: 2020" maxLength={4} required />
              {errors.ano && <span className="text-red-500 text-sm mt-1">{errors.ano}</span>}
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="cor" className="font-semibold text-gray-700 mb-2 text-sm">Cor</label>
              <select id="cor" name="cor" value={formData.cor} onChange={handleInputChange} disabled={loading} className={inputClass('cor')} required>
                <option value="">Selecione a cor</option>
                {cores.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.cor && <span className="text-red-500 text-sm mt-1">{errors.cor}</span>}
            </div>
          </div>

          {/* Placa + Porte */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col flex-1">
              <label htmlFor="placa" className="font-semibold text-gray-700 mb-2 text-sm">Placa</label>
              <input type="text" id="placa" name="placa" value={formData.placa} onChange={handleInputChange} disabled={loading} className={inputClass('placa')} placeholder="ABC-1234 ou ABC1D23" maxLength={7} required />
              {errors.placa && <span className="text-red-500 text-sm mt-1">{errors.placa}</span>}
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="porte" className="font-semibold text-gray-700 mb-2 text-sm">Porte</label>
              <select id="porte" name="porte" value={formData.porte} onChange={handleInputChange} disabled={loading} className={inputClass('porte')} required>
                <option value="">Selecione o porte</option>
                {portes.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.porte && <span className="text-red-500 text-sm mt-1">{errors.porte}</span>}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-white text-gray-500 border-2 border-gray-200 px-6 py-3.5 rounded-lg font-semibold cursor-pointer transition-all hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#B30000] text-white border-none px-6 py-3.5 rounded-lg font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 hover:bg-[#990000] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                  {modo === 'editar' ? 'Atualizando...' : 'Cadastrando...'}
                </>
              ) : (
                modo === 'editar' ? 'Atualizar' : 'Cadastrar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}