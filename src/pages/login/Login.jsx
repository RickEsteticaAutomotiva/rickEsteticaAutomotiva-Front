import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { authService } from "../../services/AuthService";
import { UseAuth } from "../../hooks/UseAuth";
import { ROUTES } from "../../constants/routes";

export function Login() {
  const [formData, setFormData] = useState({
    email: "",
    senha: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { login } = UseAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.senha) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.login(formData.email, formData.senha);
      
      login(formData.email, formData.senha);
      console.log("Login bem-sucedido:", response);
      navigate(ROUTES.HOME);
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError(error.message || "Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        
        <form onSubmit={handleLogin}>
          {error && (
            <div className="text-red-600 mb-4">{error}</div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full p-3 border rounded mb-4"
            required
          />
          
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full p-3 border rounded mb-4"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}