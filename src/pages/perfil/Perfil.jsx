import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "../../components/header/Header";
import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb";
import { UseAuth } from "../../hooks/UseAuth";
import { usuarioService } from "../../services/UsuarioService";
import { ROUTES } from "../../constants/Routes";
import { LoadingState } from "../../components/loading-state/LoadingState";
import "./Perfil.css";
import { Footer } from '../../components/footer/Footer';

export function Perfil() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [senhaData, setSenhaData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: ""
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const { user, logout, isAuthenticated } = UseAuth();

  const breadcrumbItems = [
    {
      label: 'Início',
      href: ROUTES.HOME,
      icon: 'bi bi-house'
    },
    {
      label: 'Meu Perfil',
      icon: 'bi bi-person'
    }
  ];

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }
    
    buscarPerfil();
  }, [user]);

  const buscarPerfil = async () => {
    setLoading(true);
    try {
      const data = await usuarioService.obterPerfil(user.id);
      setFormData({
        nome: data.nome || "",
        email: data.email || "",
        telefone: data.telefone || "",
        cpf: data.cpf || "",
        dataNascimento: data.dataNascimento || ""
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

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
    return numericValue
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.telefone) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (formData.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = "Telefone inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!senhaData.senhaAtual) {
      newErrors.senhaAtual = "Senha atual é obrigatória";
    }

    if (!senhaData.novaSenha) {
      newErrors.novaSenha = "Nova senha é obrigatória";
    } else if (senhaData.novaSenha.length < 6) {
      newErrors.novaSenha = "Nova senha deve ter pelo menos 6 caracteres";
    }

    if (!senhaData.confirmarSenha) {
      newErrors.confirmarSenha = "Confirmação de senha é obrigatória";
    } else if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      newErrors.confirmarSenha = "Senhas não coincidem";
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

    setSaving(true);

    try {
      const userData = {
        nome: formData.nome.trim(),
        email: formData.email.toLowerCase().trim(),
        telefone: formData.telefone.replace(/\D/g, ''),
        cpf: formData.cpf.replace(/\D/g, ''),
        dataNascimento: formData.dataNascimento
      };

      await usuarioService.atualizarPerfil(user.id, userData);

      setIsEditing(false);
      setErrors({ success: 'Perfil atualizado com sucesso!' });

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setErrors({
        submit: error.message || "Erro ao atualizar perfil. Tente novamente."
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setSaving(true);

    try {
      await usuarioService.alterarSenha(user.id, {
        senhaAtual: senhaData.senhaAtual,
        novaSenha: senhaData.novaSenha
      });

      setSenhaData({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: ""
      });
      setShowPasswordForm(false);
      setErrors({ success: 'Senha alterada com sucesso!' });

    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setErrors({
        password: error.message || "Erro ao alterar senha. Verifique a senha atual."
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setSenhaData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      usuarioService.deletarUsuario(user.id);
      logout();
      navigate(ROUTES.HOME);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <>
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      <div className="perfil-container">
        <div className="perfil-card">
          <div className="perfil-header">
            <div className="perfil-avatar">
              <i className="bi bi-person-circle"></i>
            </div>
            <div className="perfil-info">
              <h1 className="perfil-title">Meu Perfil</h1>
              <p className="perfil-subtitle">
                Gerencie suas informações pessoais
              </p>
            </div>
            <div className="perfil-actions">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-edit"
                >
                  <i className="bi bi-pencil mr-2"></i>
                  Editar
                </button>
              ) : (
                <div className="edit-actions">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setErrors({});
                      buscarPerfil();
                    }}
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="perfil-content">
            {errors.submit && (
              <div className="error-message">
                <i className="bi bi-exclamation-triangle mr-2"></i>
                {errors.submit}
              </div>
            )}

            {errors.success && (
              <div className="success-message">
                <i className="bi bi-check-circle mr-2"></i>
                {errors.success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="perfil-form">
              <div className="form-section">
                <h3 className="section-title">Informações Pessoais</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nome" className="form-label">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      disabled={!isEditing || saving}
                      className={`form-input ${errors.nome ? 'error' : ''} ${!isEditing ? 'disabled' : ''}`}
                      placeholder="Digite seu nome completo"
                      maxLength={100}
                    />
                    {errors.nome && (
                      <span className="error-text">{errors.nome}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cpf" className="form-label">
                      CPF
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      disabled={true}
                      className="form-input disabled"
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing || saving}
                      className={`form-input ${errors.email ? 'error' : ''} ${!isEditing ? 'disabled' : ''}`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <span className="error-text">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefone" className="form-label">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      disabled={!isEditing || saving}
                      className={`form-input ${errors.telefone ? 'error' : ''} ${!isEditing ? 'disabled' : ''}`}
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
                    <label htmlFor="dataNascimento" className="form-label">
                      Data de nascimento
                    </label>
                    <input
                      type="date"
                      id="dataNascimento"
                      name="dataNascimento"
                      value={formData.dataNascimento}
                      onChange={handleInputChange}
                      disabled={!isEditing || saving}
                      className={`form-input ${!isEditing ? 'disabled' : ''}`}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>


              {isEditing && (
                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-save"
                  >
                    {saving ? (
                      <>
                        <div className="button-spinner"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check mr-2"></i>
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>

            <div className="form-section">
              <div className="section-header">
                <div>
                  <h3 className="section-title">Segurança</h3>
                  <p className="section-description">
                    Altere sua senha para manter sua conta segura
                  </p>
                </div>
                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="btn-secondary"
                  >
                    <i className="bi bi-key"></i>
                    Alterar Senha
                  </button>
                )}
              </div>

              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="password-form">
                  {errors.password && (
                    <div className="error-message">
                      <i className="bi bi-exclamation-triangle mr-2"></i>
                      {errors.password}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="senhaAtual" className="form-label">
                      Senha atual
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="senhaAtual"
                        name="senhaAtual"
                        value={senhaData.senhaAtual}
                        onChange={handlePasswordInputChange}
                        disabled={saving}
                        className={`form-input ${errors.senhaAtual ? 'error' : ''}`}
                        placeholder="Digite sua senha atual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    {errors.senhaAtual && (
                      <span className="error-text">{errors.senhaAtual}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="novaSenha" className="form-label">
                      Nova senha
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="novaSenha"
                      name="novaSenha"
                      value={senhaData.novaSenha}
                      onChange={handlePasswordInputChange}
                      disabled={saving}
                      className={`form-input ${errors.novaSenha ? 'error' : ''}`}
                      placeholder="Digite a nova senha (mínimo 6 caracteres)"
                    />
                    {errors.novaSenha && (
                      <span className="error-text">{errors.novaSenha}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmarSenha" className="form-label">
                      Confirmar nova senha
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmarSenha"
                      name="confirmarSenha"
                      value={senhaData.confirmarSenha}
                      onChange={handlePasswordInputChange}
                      disabled={saving}
                      className={`form-input ${errors.confirmarSenha ? 'error' : ''}`}
                      placeholder="Confirme a nova senha"
                    />
                    {errors.confirmarSenha && (
                      <span className="error-text">{errors.confirmarSenha}</span>
                    )}
                  </div>

                  <div className="form-actions border-b-0">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setSenhaData({
                          senhaAtual: "",
                          novaSenha: "",
                          confirmarSenha: ""
                        });
                        setErrors({});
                      }}
                      className="btn-cancel"
                      disabled={saving}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-save"
                    >
                      {saving ? (
                        <>
                          <div className="button-spinner"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-shield-check mr-2"></i>
                          Alterar Senha
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="form-section danger-zone">
              <h3 className="section-title">Zona de Perigo</h3>
              <p className="section-description">
                Uma vez excluída, a conta não poderá ser recuperada.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="btn-danger"
              >
                <i className="bi bi-trash mr-2"></i>
                Excluir Conta
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}