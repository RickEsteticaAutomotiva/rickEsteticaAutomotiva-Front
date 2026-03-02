import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { authService } from "../../services/AuthService";
import { UseAuth } from "../../hooks/UseAuth";
import { ROUTES } from "../../constants/Routes";
import { useToast } from '../../context/ToastContext';
import { TiposToast } from '../../utils/enum/TiposToast';
import { Footer } from "../../components/footer/Footer";

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
  const { mostrarToast } = useToast();

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

      mostrarToast({
        tipo: TiposToast.SUCESSO,
        titulo: 'Conta criada!',
        mensagem: 'Seja bem-vindo! Sua conta foi criada com sucesso.',
        duracao: 4000
      });

      navigate(ROUTES.HOME);
      
    } catch (error) {
      mostrarToast({
        tipo: TiposToast.ERRO,
        titulo: 'Erro no cadastro',
        mensagem: error.message || 'Não foi possível criar a conta. Tente novamente.',
        duracao: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-[800px] overflow-hidden">
          <div className="px-8 pt-8 pb-4 text-center border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Criar conta</h1>
            <p className="text-gray-500">
              Preencha os dados abaixo para criar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6">
              <label htmlFor="nome" className="block font-semibold text-gray-700 mb-1.5 text-sm">
                Nome completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed${errors.nome ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                placeholder="Digite seu nome completo"
                maxLength={100}
              />
              {errors.nome && (
                <span className="block text-red-500 text-sm mt-1.5">{errors.nome}</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="cpf" className="block font-semibold text-gray-700 mb-1.5 text-sm">
                  CPF
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed${errors.cpf ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {errors.cpf && (
                  <span className="block text-red-500 text-sm mt-1.5">{errors.cpf}</span>
                )}
              </div>

              <div className="flex-1">
                <label htmlFor="dataNascimento" className="block font-semibold text-gray-700 mb-1.5 text-sm">
                  Data de nascimento
                </label>
                <input
                  type="date"
                  id="dataNascimento"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed${errors.dataNascimento ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.dataNascimento && (
                  <span className="block text-red-500 text-sm mt-1.5">{errors.dataNascimento}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="email" className="block font-semibold text-gray-700 mb-1.5 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed${errors.email ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <span className="block text-red-500 text-sm mt-1.5">{errors.email}</span>
                )}
              </div>

              <div className="flex-1">
                <label htmlFor="telefone" className="block font-semibold text-gray-700 mb-1.5 text-sm">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed${errors.telefone ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
                {errors.telefone && (
                  <span className="block text-red-500 text-sm mt-1.5">{errors.telefone}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <label htmlFor="senha" className="block font-semibold text-gray-700 mb-1.5 text-sm">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`w-full pr-12 px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed${errors.senha ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 p-1 rounded hover:text-[#B30000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>
                {errors.senha && (
                  <span className="block text-red-500 text-sm mt-1.5">{errors.senha}</span>
                )}
              </div>

              <div className="flex-1">
                <label htmlFor="confirmarSenha" className="block font-semibold text-gray-700 mb-1.5 text-sm">
                  Confirmar senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`w-full pr-12 px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed${errors.confirmarSenha ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                    placeholder="Repita a senha"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 p-1 rounded hover:text-[#B30000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                  </button>
                </div>
                {errors.confirmarSenha && (
                  <span className="block text-red-500 text-sm mt-1.5">{errors.confirmarSenha}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-[#B30000] to-[#990000] text-white py-4 rounded-lg font-semibold text-base cursor-pointer hover:shadow-lg hover:-translate-y-0.5 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                  Criando conta...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus"></i>
                  Criar conta
                </>
              )}
            </button>

            <div className="mt-8 text-center pt-6 border-t border-gray-200">
              <p className="text-gray-500">
                Já tem uma conta?{' '}
                <Link to={ROUTES.LOGIN} className="text-[#B30000] font-semibold hover:underline">
                  Fazer login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}