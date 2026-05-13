import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { authService } from "../../services/AuthService";
import { ROUTES } from "../../constants/Routes";
import { validarSenhaForte } from "../../utils/validacao/senhaValidacao";
import { PasswordChecklist } from "../../components/password-checklist/PasswordChecklist";

export function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({ novaSenha: "", confirmarSenha: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenInvalid, setTokenInvalid] = useState(!token);

  useEffect(() => {
    if (!token) setTokenInvalid(true);
  }, [token]);

  const validate = () => {
    const newErrors = {};

    const senhaValidation = validarSenhaForte(formData.novaSenha);
    if (!senhaValidation.isValid) {
      newErrors.novaSenha = senhaValidation.errors;
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = "Confirmação de senha é obrigatória";
    } else if (formData.novaSenha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await authService.redefinirSenha(token, formData.novaSenha);
      setSuccess(true);
    } catch (error) {
      if (error.message?.toLowerCase().includes("token")) {
        setTokenInvalid(true);
      } else {
        setErrors({ form: error.message || "Erro ao redefinir senha. Tente novamente." });
      }
    } finally {
      setLoading(false);
    }
  };

  if (tokenInvalid) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden animate-[slide-in-up_0.6s_ease-out]">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-x-circle text-red-600 text-2xl"></i>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Link inválido ou expirado</h2>
              <p className="text-gray-500 text-sm mb-8">
                Este link de redefinição de senha é inválido ou já expirou.
                Solicite um novo link para continuar.
              </p>
              <Link
                to={ROUTES.ESQUECI_SENHA}
                className="block w-full bg-gradient-to-br from-[#B30000] to-[#990000] text-white py-3.5 rounded-lg font-semibold text-sm text-center hover:shadow-lg transition-all mb-4"
              >Solicitar novo link
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="block text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (success) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden animate-[slide-in-up_0.6s_ease-out]">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="bi bi-check-circle text-green-600 text-2xl"></i>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Senha redefinida!</h2>
              <p className="text-gray-500 text-sm mb-8">
                Sua senha foi alterada com sucesso. Faça login com a nova senha.
              </p>
              <button
                type="button"
                onClick={() => navigate(ROUTES.LOGIN)}
                className="w-full bg-gradient-to-br from-[#B30000] to-[#990000] text-white py-3.5 rounded-lg font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <i className="bi bi-box-arrow-in-right"></i>{' '}Ir para o login
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden animate-[slide-in-up_0.6s_ease-out]">
          <div className="px-8 pt-8 pb-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="w-14 h-14 bg-[#B30000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-shield-lock text-[#B30000] text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Redefinir senha</h1>
            <p className="text-gray-500 text-sm">
              Escolha uma nova senha segura para sua conta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {errors.form && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                <i className="bi bi-exclamation-circle mr-2"></i>
                {errors.form}
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="novaSenha" className="block font-semibold text-gray-700 mb-1.5 text-sm">
                Nova senha
              </label>
              <div className="relative">
                <i className="bi bi-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-[2]"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="novaSenha"
                  name="novaSenha"
                  value={formData.novaSenha}
                  onChange={handleChange}
                  disabled={loading}
                  minLength={8}
                  autoFocus
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed${errors.novaSenha ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                  placeholder="Minimo 8 caracteres"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 z-[2] p-1 rounded hover:text-[#B30000] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
              <PasswordChecklist senha={formData.novaSenha} />
              {errors.novaSenha && (
                Array.isArray(errors.novaSenha) ? (
                  <ul className="mt-1.5 space-y-1">
                    {errors.novaSenha.map((erro) => (
                      <li key={erro} className="text-red-500 text-sm">{erro}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="block text-red-500 text-sm mt-1.5">{errors.novaSenha}</span>
                )
              )}
            </div>

            <div className="mb-8">
              <label htmlFor="confirmarSenha" className="block font-semibold text-gray-700 mb-1.5 text-sm">
                Confirmar nova senha
              </label>
              <div className="relative">
                <i className="bi bi-lock-fill absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-[2]"></i>
                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed${errors.confirmarSenha ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 z-[2] p-1 rounded hover:text-[#B30000] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                >
                  <i className={`bi bi-eye${showConfirm ? '-slash' : ''}`}></i>
                </button>
              </div>
              {errors.confirmarSenha && (
                <span className="block text-red-500 text-sm mt-1.5">{errors.confirmarSenha}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-[#B30000] to-[#990000] text-white py-4 rounded-lg font-semibold text-base cursor-pointer hover:shadow-lg hover:-translate-y-0.5 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-2 mb-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                  Redefinindo...
                </>
              ) : (
                <>
                  Redefinir senha
                </>
              )}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <Link to={ROUTES.LOGIN} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Voltar para o login
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
