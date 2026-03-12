import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { authService } from "../../services/AuthService";
import { ROUTES } from "../../constants/Routes";

export function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email é obrigatório");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Email inválido");
      return;
    }

    setEmailError("");
    setLoading(true);

    try {
      await authService.esquecerSenha(email);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden animate-[slide-in-up_0.6s_ease-out]">
          <div className="px-8 pt-8 pb-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="w-14 h-14 bg-[#B30000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-lock text-[#B30000] text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Esqueci minha senha</h1>
            <p className="text-gray-500 text-sm">
              Informe seu e-mail de cadastro e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          <div className="p-8">
            {submitted ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="bi bi-envelope-check text-green-600 text-2xl"></i>
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Verifique seu e-mail</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Se houver uma conta com o e-mail <span className="font-medium text-gray-700">{email}</span>,
                  você receberá um link para redefinir sua senha em breve.
                </p>
                <p className="text-gray-400 text-xs mb-8">
                  Não recebeu o e-mail? Verifique sua pasta de spam ou tente novamente.
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setEmail(""); }}
                  className="w-full border-2 border-[#B30000] text-[#B30000] py-3 rounded-lg font-semibold text-sm hover:bg-[#B30000]/5 transition-colors mb-4"
                >
                  Tentar com outro e-mail
                </button>
                <Link
                  to={ROUTES.LOGIN}
                  className="block text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Voltar para o login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block font-semibold text-gray-700 mb-1.5 text-sm">
                    E-mail
                  </label>
                  <div className="relative">
                    <i className="bi bi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-[2]"></i>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      disabled={loading}
                      className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed${emailError ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                      placeholder="Digite seu e-mail cadastrado"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {emailError && (
                    <span className="block text-red-500 text-sm mt-1.5">{emailError}</span>
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
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar link de redefinição
                    </>
                  )}
                </button>

                <div className="text-center pt-4 border-t border-gray-200">
                  <Link
                    to={ROUTES.LOGIN}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Voltar para o login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
