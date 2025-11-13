import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { UseAuth } from "../../hooks/UseAuth";
import { ROUTES } from "../../constants/Routes";
import "./Login.css";
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
  const { login } = UseAuth();

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
      await login(formData.email.toLowerCase().trim(), formData.senha);
      
      // Salvar preferência de "lembrar-me" se necessário
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', formData.email.toLowerCase().trim());
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userEmail');
      }
      
      navigate(ROUTES.HOME);
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrors({ 
        submit: error.message || "Email ou senha incorretos. Tente novamente." 
      });
    } finally {
      setLoading(false);
    }
  };

  // Carregar email salvo se "lembrar-me" estiver ativo
  useState(() => {
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
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Bem-vindo de volta!</h1>
            <p className="login-subtitle">
              Faça login para acessar sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {errors.submit && (
              <div className="error-message submit-error">
                <i className="bi bi-exclamation-triangle mr-2"></i>
                {errors.submit}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <div className="input-container">
                <i className="bi bi-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`form-input with-icon ${errors.email ? 'error' : ''}`}
                  placeholder="Digite seu email"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="senha" className="form-label">
                Senha
              </label>
              <div className="input-container">
                <i className="bi bi-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`form-input with-icon ${errors.senha ? 'error' : ''}`}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
              {errors.senha && (
                <span className="error-text">{errors.senha}</span>
              )}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                Lembrar-me
              </label>

              <Link to={ROUTES.ESQUECI_SENHA} className="forgot-password-link">
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-button"
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right mr-2"></i>
                  Entrar
                </>
              )}
            </button>

            <div className="form-footer">
              <p className="signup-link">
                Não tem uma conta?{' '}
                <Link to={ROUTES.CADASTRAR} className="link">
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