import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { authService } from "../../services/AuthService";
import { UseAuth } from "../../hooks/UseAuth";
import { ROUTES } from "../../constants/routes";
import "./Cadastrar.css";

export function Cadastrar() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    dataNascimento: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = UseAuth();

  const formatCPF = (value) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
  };

  const formatTelefone = (value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      return numericValue
        .slice(0, 10)
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return numericValue
        .slice(0, 11)
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  const validateCPF = (cpf) => {
    const numericCPF = cpf.replace(/\D/g, '');
    
    if (numericCPF.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(numericCPF)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numericCPF.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 === 10 || digit1 === 11) digit1 = 0;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numericCPF.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 === 10 || digit2 === 11) digit2 = 0;

    return digit1 === parseInt(numericCPF.charAt(9)) && digit2 === parseInt(numericCPF.charAt(10));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!formData.cpf) {
      newErrors.cpf = "CPF é obrigatório";
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = "Confirmação de senha é obrigatória";
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "Senhas não coincidem";
    }

    if (!formData.telefone) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (formData.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = "Telefone inválido";
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = "Data de nascimento é obrigatória";
    } else {
      const birthDate = new Date(formData.dataNascimento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 16 || age > 120) {
        newErrors.dataNascimento = "Idade deve estar entre 16 e 120 anos";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'telefone') {
      formattedValue = formatTelefone(value);
    } else if (name === 'nome') {
      formattedValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
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
      const userData = {
        nome: formData.nome.trim(),
        cpf: formData.cpf.replace(/\D/g, ''),
        email: formData.email.toLowerCase().trim(),
        senha: formData.senha,
        telefone: formData.telefone.replace(/\D/g, ''),
        dataNascimento: formData.dataNascimento
      };

      const response = await authService.cadastrar(userData);
      
      // Fazer login automático após cadastro
      await login(userData.email, userData.senha);
      
      console.log("Cadastro bem-sucedido:", response);
      navigate(ROUTES.HOME);
      
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setErrors({ 
        submit: error.message || "Erro ao cadastrar. Tente novamente." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <div className="cadastro-container">
        <div className="cadastro-card">
          <div className="cadastro-header">
            <h1 className="cadastro-title">Criar conta</h1>
            <p className="cadastro-subtitle">
              Preencha os dados abaixo para criar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="cadastro-form">
            {errors.submit && (
              <div className="error-message submit-error">
                <i className="bi bi-exclamation-triangle mr-2"></i>
                {errors.submit}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="nome" className="form-label">
                Nome completo *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                disabled={loading}
                className={`form-input ${errors.nome ? 'error' : ''}`}
                placeholder="Digite seu nome completo"
                maxLength={100}
              />
              {errors.nome && (
                <span className="error-text">{errors.nome}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cpf" className="form-label">
                  CPF *
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`form-input ${errors.cpf ? 'error' : ''}`}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {errors.cpf && (
                  <span className="error-text">{errors.cpf}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dataNascimento" className="form-label">
                  Data de nascimento *
                </label>
                <input
                  type="date"
                  id="dataNascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`form-input ${errors.dataNascimento ? 'error' : ''}`}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.dataNascimento && (
                  <span className="error-text">{errors.dataNascimento}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="telefone" className="form-label">
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`form-input ${errors.telefone ? 'error' : ''}`}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
                {errors.telefone && (
                  <span className="error-text">{errors.telefone}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="senha" className="form-label">
                  Senha *
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`form-input ${errors.senha ? 'error' : ''}`}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>
                {errors.senha && (
                  <span className="error-text">{errors.senha}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmarSenha" className="form-label">
                  Confirmar senha *
                </label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`form-input ${errors.confirmarSenha ? 'error' : ''}`}
                    placeholder="Repita a senha"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>
                {errors.confirmarSenha && (
                  <span className="error-text">{errors.confirmarSenha}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  Criando conta...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus mr-2"></i>
                  Criar conta
                </>
              )}
            </button>

            <div className="form-footer">
              <p className="login-link">
                Já tem uma conta?{' '}
                <Link to={ROUTES.LOGIN} className="link">
                  Fazer login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}