import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/Routes";
import { useToast } from '../../context/ToastContext';
import { TiposToast } from '../../utils/enum/TiposToast';
import { Footer } from "../../components/footer/Footer";

export function Login() {
  const [formData, setFormData] = useState({
    email: "",
    senha: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mostrarToast } = useToast();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      const response = await login(formData.email.toLowerCase().trim(), formData.senha);
      
      // Salvar preferência de "lembrar-me" se necessário
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', formData.email.toLowerCase().trim());
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
      }
      
      const isGerente = response?.user?.roles?.includes('ROLE_GERENTE');
      navigate(isGerente ? ROUTES.GERENTE.HOME : ROUTES.HOME);
      
    } catch (error) {
      mostrarToast({
        tipo: TiposToast.ERRO,
        titulo: 'Falha no login',
        mensagem: error.message || 'Email ou senha incorretos. Tente novamente.',
        duracao: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar email salvo se "lembrar-me" estiver ativo
  useEffect(() => {
    const rememberMeEnabled = localStorage.getItem('rememberMe') === 'true';
    const savedEmail = localStorage.getItem('userEmail');
    
    if (rememberMeEnabled && savedEmail) {
      setRememberMe(true);
      setFormData(prev => ({
        ...prev,
        email: savedEmail
      }));
    }
  }, []);

  return (
    <>
      <Header />
      
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden animate-[slide-in-up_0.6s_ease-out]">
          <div className="px-8 pt-8 pb-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo de volta!</h1>
            <p className="text-gray-500">
              Faça login para acessar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6">
              <label htmlFor="email" className="block font-semibold text-gray-700 mb-1.5 text-sm">
                Email
              </label>
              <div className="relative">
                <i className="bi bi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-[2]"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed${errors.email ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                  placeholder="Digite seu email"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="block text-red-500 text-sm mt-1.5">{errors.email}</span>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="senha" className="block font-semibold text-gray-700 mb-1.5 text-sm">
                Senha
              </label>
              <div className="relative">
                <i className="bi bi-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-[2]"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed${errors.senha ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 z-[2] p-1 rounded hover:text-[#B30000] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
              {errors.senha && (
                <span className="block text-red-500 text-sm mt-1.5">{errors.senha}</span>
              )}
            </div>

            <div className="flex justify-between items-center mb-8">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 accent-[#B30000] cursor-pointer"
                />
                Lembrar-me
              </label>

              <Link to={ROUTES.ESQUECI_SENHA} className="text-[#B30000] hover:text-[#990000] hover:underline text-sm font-medium transition-colors">
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-[#B30000] to-[#990000] text-white py-4 rounded-lg font-semibold text-base cursor-pointer hover:shadow-lg hover:-translate-y-0.5 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  Entrar
                </>
              )}
            </button>

            <div className="mt-8 text-center pt-6 border-t border-gray-200">
              <p className="text-gray-500">
                Não tem uma conta?{' '}
                <Link to={ROUTES.CADASTRAR} className="text-[#B30000] font-semibold hover:underline">
                  Criar conta
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