import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "../../components/header/Header";
import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb";
import { useAuth } from "../../context/AuthContext";
import { usuarioService } from "../../services/UsuarioService";
import { ROUTES } from "../../constants/Routes";
import { LoadingState } from "../../components/loading-state/LoadingState";
import { Footer } from '../../components/footer/Footer';
import { useToast } from '../../context/ToastContext';
import { TiposToast } from '../../utils/enum/TiposToast';
import { ModalConfirmacao } from '../../components/modal-confirmacao/ModalConfirmacao';
import { validarSenhaForte } from '../../utils/validacao/senhaValidacao';
import { PasswordChecklist } from '../../components/password-checklist/PasswordChecklist';

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
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [senhaData, setSenhaData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: ""
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [modalPerfil, setModalPerfil] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const { user, logout, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const { mostrarToast } = useToast();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch {
      mostrarToast({
        tipo: TiposToast.ERRO,
        titulo: 'Erro ao carregar perfil',
        mensagem: 'Não foi possível buscar seus dados. Tente novamente.',
        duracao: 4000
      });
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

    const senhaValidation = validarSenhaForte(senhaData.novaSenha);
    if (!senhaValidation.isValid) {
      newErrors.novaSenha = senhaValidation.errors;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setModalPerfil(true);
  };

  const handleSubmitConfirmed = async () => {
    setModalPerfil(false);
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
      updateUser({ nome: userData.nome, email: userData.email });

      setIsEditing(false);
      setShowPasswordForm(false);
      mostrarToast({
        tipo: TiposToast.SUCESSO,
        titulo: 'Perfil atualizado',
        mensagem: 'Suas informações foram salvas com sucesso.',
        duracao: 4000
      });

    } catch (error) {
      mostrarToast({
        tipo: TiposToast.ERRO,
        titulo: 'Erro ao atualizar perfil',
        mensagem: error.message || 'Erro ao atualizar perfil. Tente novamente.',
        duracao: 5000
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    setModalSenha(true);
  };

  const handlePasswordChangeConfirmed = async () => {
    setModalSenha(false);
    setSaving(true);
    try {
      await usuarioService.alterarSenha(user.id, {
        senhaAtual: senhaData.senhaAtual,
        novaSenha: senhaData.novaSenha
      });

      setSenhaData({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
      setShowPasswordForm(false);
      mostrarToast({
        tipo: TiposToast.SUCESSO,
        titulo: 'Senha alterada',
        mensagem: 'Sua senha foi alterada com sucesso.',
        duracao: 4000
      });

    } catch (error) {
      mostrarToast({
        tipo: TiposToast.ERRO,
        titulo: 'Erro ao alterar senha',
        mensagem: error.message || 'Verifique a senha atual e tente novamente.',
        duracao: 5000
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
    setModalExcluir(true);
  };

  const handleDeleteAccountConfirmed = async () => {
    setModalExcluir(false);
    await usuarioService.deletarUsuario(user.id);
    logout();
    navigate(ROUTES.HOME);
  };

  const inputCls = (field, alwaysDisabled = false) =>
    `w-full px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10${errors[field] ? ' border-red-500 bg-red-50' : ' border-gray-200'}${(!isEditing || alwaysDisabled) ? ' bg-gray-50 text-gray-400 cursor-not-allowed' : ' bg-white'}`;

  if (loading) {
    return <LoadingState />;
  }

  return (
    <>
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      <div className="bg-gray-50 min-h-[calc(100vh-80px)] p-4 md:p-8">
        <div className="max-w-[900px] mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="text-6xl text-gray-400">
              <i className="bi bi-person-circle"></i>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
              <p className="text-gray-500">Gerencie suas informações pessoais</p>
            </div>
            <div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:border-[#B30000] hover:text-[#B30000] transition-colors font-medium"
                >
                  <i className="bi bi-pencil"></i>
                  Editar
                </button>
              ) : (
                <button
                  onClick={() => { setIsEditing(false); setShowPasswordForm(false); setErrors({}); buscarPerfil(); }}
                  className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-500 px-4 py-2 rounded-lg hover:border-gray-400 transition-colors font-medium"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-8">
            {/* Informações Pessoais */}
            <form onSubmit={handleSubmit}>
              <div className="pb-8 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-6">Informações Pessoais</h3>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label htmlFor="nome" className="block font-semibold text-gray-700 mb-1.5 text-sm">Nome completo</label>
                    <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleInputChange}
                      disabled={!isEditing || saving} className={inputCls('nome')} placeholder="Digite seu nome completo" maxLength={100} />
                    {errors.nome && <span className="block text-red-500 text-sm mt-1.5">{errors.nome}</span>}
                  </div>

                  <div className="flex-1">
                    <label htmlFor="cpf" className="block font-semibold text-gray-700 mb-1.5 text-sm">CPF</label>
                    <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleInputChange}
                      disabled={true} className={inputCls('cpf', true)} placeholder="000.000.000-00" maxLength={14} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <label htmlFor="email" className="block font-semibold text-gray-700 mb-1.5 text-sm">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange}
                      disabled={!isEditing || saving} className={inputCls('email')} placeholder="seu@email.com" />
                    {errors.email && <span className="block text-red-500 text-sm mt-1.5">{errors.email}</span>}
                  </div>

                  <div className="flex-1">
                    <label htmlFor="telefone" className="block font-semibold text-gray-700 mb-1.5 text-sm">Telefone</label>
                    <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleInputChange}
                      disabled={!isEditing || saving} className={inputCls('telefone')} placeholder="(11) 99999-9999" maxLength={15} />
                    {errors.telefone && <span className="block text-red-500 text-sm mt-1.5">{errors.telefone}</span>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 max-w-xs">
                    <label htmlFor="dataNascimento" className="block font-semibold text-gray-700 mb-1.5 text-sm">Data de nascimento</label>
                    <input type="date" id="dataNascimento" name="dataNascimento" value={formData.dataNascimento} onChange={handleInputChange}
                      disabled={!isEditing || saving} className={inputCls('dataNascimento')} max={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end mt-6">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 bg-[#B30000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#990000] hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none transition-all">
                    {saving ? (
                      <><div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"></div>Salvando...</>
                    ) : (
                      <><i className="bi bi-check"></i>Salvar Alterações</>
                    )}
                  </button>
                </div>
              )}
            </form>

            {/* Segurança */}
            {isEditing && <div className="py-8 border-y border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Segurança</h3>
                  <p className="text-gray-500 text-sm">Altere sua senha para manter sua conta segura</p>
                </div>
                {!showPasswordForm && (
                  <button onClick={() => setShowPasswordForm(true)}
                    className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:border-[#B30000] hover:text-[#B30000] transition-colors font-medium whitespace-nowrap">
                    <i className="bi bi-key"></i>Alterar Senha
                  </button>
                )}
              </div>

              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="senhaAtual" className="block font-semibold text-gray-700 mb-1.5 text-sm">Senha atual</label>
                    <div className="relative">
                      <input type={showSenhaAtual ? "text" : "password"} id="senhaAtual" name="senhaAtual"
                        value={senhaData.senhaAtual} onChange={handlePasswordInputChange} disabled={saving}
                        className={`w-full pr-12 px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400${errors.senhaAtual ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                        placeholder="Digite sua senha atual" />
                      <button
                        type="button"
                        onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 p-1 hover:text-[#B30000] transition-colors">
                        <i className={`bi ${showSenhaAtual ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    {errors.senhaAtual && <span className="block text-red-500 text-sm mt-1.5">{errors.senhaAtual}</span>}
                  </div>

                  <div>
                    <label htmlFor="novaSenha" className="block font-semibold text-gray-700 mb-1.5 text-sm">Nova senha</label>
                    <div className="relative">
                      <input type={showNovaSenha ? "text" : "password"} id="novaSenha" name="novaSenha"
                        value={senhaData.novaSenha} onChange={handlePasswordInputChange} disabled={saving}
                        className={`w-full pr-12 px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400${errors.novaSenha ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                        placeholder="Digite a nova senha (minimo 8 caracteres)"
                        minLength={8} />
                      <button
                        type="button"
                        onClick={() => setShowNovaSenha(!showNovaSenha)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 p-1 hover:text-[#B30000] transition-colors"
                      >
                        <i className={`bi ${showNovaSenha ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    <PasswordChecklist senha={senhaData.novaSenha} />
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

                  <div>
                    <label htmlFor="confirmarSenha" className="block font-semibold text-gray-700 mb-1.5 text-sm">Confirmar nova senha</label>
                    <div className="relative">
                      <input type={showConfirmarSenha ? "text" : "password"} id="confirmarSenha" name="confirmarSenha"
                        value={senhaData.confirmarSenha} onChange={handlePasswordInputChange} disabled={saving}
                        className={`w-full pr-12 px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400${errors.confirmarSenha ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                        placeholder="Confirme a nova senha" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 p-1 hover:text-[#B30000] transition-colors"
                      >
                        <i className={`bi ${showConfirmarSenha ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    {errors.confirmarSenha && <span className="block text-red-500 text-sm mt-1.5">{errors.confirmarSenha}</span>}
                  </div>

                  <div className="flex gap-4 justify-end mt-2">
                    <button type="button" disabled={saving}
                      onClick={() => { setShowPasswordForm(false); setSenhaData({ senhaAtual: "", novaSenha: "", confirmarSenha: "" }); setErrors({}); }}
                      className="px-5 py-2.5 border-2 border-gray-200 text-gray-600 rounded-lg hover:border-gray-400 transition-colors font-medium disabled:opacity-50">
                      Cancelar
                    </button>
                    <button type="submit" disabled={saving}
                      className="flex items-center gap-2 bg-[#B30000] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#990000] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                      {saving ? (
                        <><div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"></div>Salvando...</>
                      ) : (
                        <><i className="bi bi-shield-check"></i>Alterar Senha</>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>}

            {/* Zona de Perigo */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-700 mb-2">Zona de Perigo</h3>
              <p className="text-gray-500 text-sm mb-4">Uma vez excluída, a conta não poderá ser recuperada.</p>
              <button onClick={handleDeleteAccount}
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                <i className="bi bi-trash"></i>Excluir Conta
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <ModalConfirmacao
        isOpen={modalPerfil}
        onClose={() => setModalPerfil(false)}
        onConfirm={handleSubmitConfirmed}
        titulo="Salvar alterações"
        mensagem="Deseja salvar as alterações feitas no seu perfil?"
        textoBotaoConfirmar="Salvar"
        tipo="default"
        loading={saving}
      />

      <ModalConfirmacao
        isOpen={modalSenha}
        onClose={() => setModalSenha(false)}
        onConfirm={handlePasswordChangeConfirmed}
        titulo="Alterar senha"
        mensagem="Deseja alterar sua senha? Você continuará logado com a nova senha."
        textoBotaoConfirmar="Alterar Senha"
        tipo="warning"
        loading={saving}
      />

      <ModalConfirmacao
        isOpen={modalExcluir}
        onClose={() => setModalExcluir(false)}
        onConfirm={handleDeleteAccountConfirmed}
        titulo="Excluir conta"
        mensagem="Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão perdidos."
        textoBotaoConfirmar="Excluir Conta"
        tipo="danger"
      />
    </>
  );
}