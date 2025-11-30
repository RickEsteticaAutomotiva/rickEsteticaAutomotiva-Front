import { useState, useEffect } from 'react';
import { VeiculoService } from '../../services/VeiculoService';
import { UseAuth } from '../../hooks/UseAuth';
import './ModalVeiculo.css';
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

  const veiculoService = new VeiculoService();
  const { user } = UseAuth();

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
      console.error('Erro ao salvar veículo:', error);
      setErrors({
        submit: error.message || `Erro ao ${modo === 'editar' ? 'atualizar' : 'cadastrar'} veículo`
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

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-veiculo" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <i className="bi bi-car-front mr-2"></i>
            {modo === 'editar' ? 'Editar Veículo' : 'Adicionar Novo Veículo'}
          </h2>
          <button 
            className="modal-close"
            onClick={handleClose}
            disabled={loading}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errors.submit && (
            <div className="error-message">
              <i className="bi bi-exclamation-triangle mr-2"></i>
              {errors.submit}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="marca" className="form-label">
                Marca
              </label>
              <select
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                disabled={loading}
                className={`form-input ${errors.marca ? 'error' : ''}`}
                required
              >
                <option value="">Selecione a marca</option>
                {marcas.map(marca => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
              {errors.marca && (
                <span className="error-text">{errors.marca}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="modelo" className="form-label">
                Modelo
              </label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleInputChange}
                disabled={loading}
                className={`form-input ${errors.modelo ? 'error' : ''}`}
                placeholder="Ex: Civic, Corolla, Gol"
                maxLength={50}
                required
              />
              {errors.modelo && (
                <span className="error-text">{errors.modelo}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ano" className="form-label">
                Ano
              </label>
              <input
                type="text"
                id="ano"
                name="ano"
                value={formData.ano}
                onChange={handleInputChange}
                disabled={loading}
                className={`form-input ${errors.ano ? 'error' : ''}`}
                placeholder="Ex: 2020"
                maxLength={4}
                required
              />
              {errors.ano && (
                <span className="error-text">{errors.ano}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cor" className="form-label">
                Cor
              </label>
              <select
                id="cor"
                name="cor"
                value={formData.cor}
                onChange={handleInputChange}
                disabled={loading}
                className={`form-input ${errors.cor ? 'error' : ''}`}
                required
              >
                <option value="">Selecione a cor</option>
                {cores.map(cor => (
                  <option key={cor} value={cor}>{cor}</option>
                ))}
              </select>
              {errors.cor && (
                <span className="error-text">{errors.cor}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="placa" className="form-label">
                Placa
              </label>
              <input
                type="text"
                id="placa"
                name="placa"
                value={formData.placa}
                onChange={handleInputChange}
                disabled={loading}
                className={`form-input ${errors.placa ? 'error' : ''}`}
                placeholder="ABC-1234 ou ABC1D23"
                maxLength={7}
                required
              />
              {errors.placa && (
                <span className="error-text">{errors.placa}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="porte" className="form-label">
                Porte
              </label>
              <select
                id="porte"
                name="porte"
                value={formData.porte}
                onChange={handleInputChange}
                disabled={loading}
                className={`form-input ${errors.porte ? 'error' : ''}`}
                required
              >
                <option value="">Selecione o porte</option>
                {portes.map(porte => (
                  <option key={porte} value={porte}>{porte}</option>
                ))}
              </select>
              {errors.porte && (
                <span className="error-text">{errors.porte}</span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-save"
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  {modo === 'editar' ? 'Atualizando...' : 'Cadastrando...'}
                </>
              ) : (
                <>
                  {modo === 'editar' ? 'Atualizar' : 'Cadastrar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}