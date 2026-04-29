import { useEffect, useState } from 'react';
import { UseAuth } from '../../../hooks/UseAuth';
import { usuarioService } from '../../../services/UsuarioService';
import { useToast } from '../../../context/ToastContext';
import { TiposToast } from '../../../utils/enum/TiposToast';
import { ModalConfirmacao } from '../../../components/modal-confirmacao/ModalConfirmacao';
import { LoadingState } from '../../../components/loading-state/LoadingState';

export function PerfilGerente() {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        dataNascimento: ''
    });
    const [senhaData, setSenhaData] = useState({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [modalPerfil, setModalPerfil] = useState(false);
    const [modalSenha, setModalSenha] = useState(false);

    const { user, updateUser } = UseAuth();
    const { mostrarToast } = useToast();

    useEffect(() => {
        if (!user?.id) return;
        buscarPerfil();
    }, [user?.id]);

    const buscarPerfil = async () => {
        setLoading(true);
        try {
            const data = await usuarioService.obterPerfil(user.id);
            setFormData({
                nome: data.nome || '',
                email: data.email || '',
                telefone: data.telefone || '',
                cpf: data.cpf || '',
                dataNascimento: data.dataNascimento || ''
            });
        } catch {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao carregar perfil',
                mensagem: 'Nao foi possivel carregar os dados do perfil.',
                duracao: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    const formatCPF = (value) => {
        const numericValue = value.replaceAll(/\D/g, '');
        return numericValue
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    };

    const formatTelefone = (value) => {
        const numericValue = value.replaceAll(/\D/g, '');
        return numericValue
            .slice(0, 11)
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome e obrigatorio';
        } else if (formData.nome.trim().length < 2) {
            newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email e obrigatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email invalido';
        }

        if (!formData.telefone) {
            newErrors.telefone = 'Telefone e obrigatorio';
        } else if (formData.telefone.replaceAll(/\D/g, '').length < 10) {
            newErrors.telefone = 'Telefone invalido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePasswordForm = () => {
        const newErrors = {};

        if (!senhaData.senhaAtual) {
            newErrors.senhaAtual = 'Senha atual e obrigatoria';
        }

        if (!senhaData.novaSenha) {
            newErrors.novaSenha = 'Nova senha e obrigatoria';
        } else if (senhaData.novaSenha.length < 6) {
            newErrors.novaSenha = 'Nova senha deve ter pelo menos 6 caracteres';
        }

        if (!senhaData.confirmarSenha) {
            newErrors.confirmarSenha = 'Confirmacao de senha e obrigatoria';
        } else if (senhaData.novaSenha !== senhaData.confirmarSenha) {
            newErrors.confirmarSenha = 'Senhas nao coincidem';
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
            formattedValue = value.replaceAll(/[^a-zA-Z\s]/g, '');
        }

        setFormData((prev) => ({
            ...prev,
            [name]: formattedValue
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ''
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
                telefone: formData.telefone.replaceAll(/\D/g, ''),
                cpf: formData.cpf.replaceAll(/\D/g, ''),
                dataNascimento: formData.dataNascimento
            };

            await usuarioService.atualizarPerfil(user.id, userData);
            updateUser({ nome: userData.nome, email: userData.email });
            setIsEditing(false);
            mostrarToast({
                tipo: TiposToast.SUCESSO,
                titulo: 'Perfil atualizado',
                mensagem: 'Informacoes salvas com sucesso.',
                duracao: 4000
            });
        } catch (error) {
            mostrarToast({
                tipo: TiposToast.ERRO,
                titulo: 'Erro ao atualizar perfil',
                mensagem: error.message || 'Nao foi possivel atualizar o perfil.',
                duracao: 5000
            });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setSenhaData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: ''
            }));
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

            setSenhaData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
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

    const cancelarEdicao = () => {
        setIsEditing(false);
        setShowPasswordForm(false);
        setErrors({});
        setSenhaData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
        buscarPerfil();
    };

    const inputCls = (field, alwaysDisabled = false) =>
        `w-full px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10${errors[field] ? ' border-red-500 bg-red-50' : ' border-gray-200'}${(!isEditing || alwaysDisabled) ? ' bg-gray-50 text-gray-400 cursor-not-allowed' : ' bg-white'}`;

    if (loading) {
        return <LoadingState />;
    }

    return (
        <>
            <div className="max-w-[900px] mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="text-6xl text-gray-400">
                        <i className="bi bi-person-circle"></i>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
                        <p className="text-gray-500">Gerencie suas informacoes e senha</p>
                    </div>
                    <div>
                        {isEditing ? (
                            <button
                                onClick={cancelarEdicao}
                                className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-500 px-4 py-2 rounded-lg hover:border-gray-400 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:border-[#B30000] hover:text-[#B30000] transition-colors font-medium"
                            >
                                Editar
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col gap-8">
                    <form onSubmit={handleSubmit}>
                        <div className="pb-8 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-700 mb-6">Informacoes Pessoais</h3>

                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <div className="flex-1">
                                    <label htmlFor="nome" className="block font-semibold text-gray-700 mb-1.5 text-sm">Nome completo</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        disabled={!isEditing || saving}
                                        className={inputCls('nome')}
                                        placeholder="Digite seu nome completo"
                                        maxLength={100}
                                    />
                                    {errors.nome && <span className="block text-red-500 text-sm mt-1.5">{errors.nome}</span>}
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="cpf" className="block font-semibold text-gray-700 mb-1.5 text-sm">CPF</label>
                                    <input
                                        type="text"
                                        id="cpf"
                                        name="cpf"
                                        value={formData.cpf}
                                        onChange={handleInputChange}
                                        disabled
                                        className={inputCls('cpf', true)}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <div className="flex-1">
                                    <label htmlFor="email" className="block font-semibold text-gray-700 mb-1.5 text-sm">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing || saving}
                                        className={inputCls('email')}
                                        placeholder="seu@email.com"
                                    />
                                    {errors.email && <span className="block text-red-500 text-sm mt-1.5">{errors.email}</span>}
                                </div>

                                <div className="flex-1">
                                    <label htmlFor="telefone" className="block font-semibold text-gray-700 mb-1.5 text-sm">Telefone</label>
                                    <input
                                        type="tel"
                                        id="telefone"
                                        name="telefone"
                                        value={formData.telefone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing || saving}
                                        className={inputCls('telefone')}
                                        placeholder="(11) 99999-9999"
                                        maxLength={15}
                                    />
                                    {errors.telefone && <span className="block text-red-500 text-sm mt-1.5">{errors.telefone}</span>}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 max-w-xs">
                                    <label htmlFor="dataNascimento" className="block font-semibold text-gray-700 mb-1.5 text-sm">Data de nascimento</label>
                                    <input
                                        type="date"
                                        id="dataNascimento"
                                        name="dataNascimento"
                                        value={formData.dataNascimento}
                                        onChange={handleInputChange}
                                        disabled={!isEditing || saving}
                                        className={inputCls('dataNascimento')}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-[#B30000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#990000] hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none transition-all"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            Salvar Alteracoes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </form>

                    {isEditing && (
                        <div className="py-8 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700">Seguranca</h3>
                                    <p className="text-gray-500 text-sm">Atualize sua senha para manter a conta segura</p>
                                </div>
                                {!showPasswordForm && (
                                    <button
                                        onClick={() => setShowPasswordForm(true)}
                                        className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:border-[#B30000] hover:text-[#B30000] transition-colors font-medium whitespace-nowrap"
                                    >
                                        Alterar Senha
                                    </button>
                                )}
                            </div>

                            {showPasswordForm && (
                                <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                                    <div>
                                        <label htmlFor="senhaAtual" className="block font-semibold text-gray-700 mb-1.5 text-sm">Senha atual</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                id="senhaAtual"
                                                name="senhaAtual"
                                                value={senhaData.senhaAtual}
                                                onChange={handlePasswordInputChange}
                                                disabled={saving}
                                                className={`w-full pr-12 px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400${errors.senhaAtual ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                                                placeholder="Digite sua senha atual"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 p-1 hover:text-[#B30000] transition-colors"
                                            >
                                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                            </button>
                                        </div>
                                        {errors.senhaAtual && <span className="block text-red-500 text-sm mt-1.5">{errors.senhaAtual}</span>}
                                    </div>

                                    <div>
                                        <label htmlFor="novaSenha" className="block font-semibold text-gray-700 mb-1.5 text-sm">Nova senha</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="novaSenha"
                                            name="novaSenha"
                                            value={senhaData.novaSenha}
                                            onChange={handlePasswordInputChange}
                                            disabled={saving}
                                            className={`w-full px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400${errors.novaSenha ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                                            placeholder="Digite a nova senha (minimo 6 caracteres)"
                                        />
                                        {errors.novaSenha && <span className="block text-red-500 text-sm mt-1.5">{errors.novaSenha}</span>}
                                    </div>

                                    <div>
                                        <label htmlFor="confirmarSenha" className="block font-semibold text-gray-700 mb-1.5 text-sm">Confirmar nova senha</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="confirmarSenha"
                                            name="confirmarSenha"
                                            value={senhaData.confirmarSenha}
                                            onChange={handlePasswordInputChange}
                                            disabled={saving}
                                            className={`w-full px-4 py-3.5 border-2 rounded-lg text-base transition-all focus:outline-none focus:border-[#B30000] focus:ring-2 focus:ring-[#B30000]/10 disabled:bg-gray-50 disabled:text-gray-400${errors.confirmarSenha ? ' border-red-500 bg-red-50' : ' border-gray-200 bg-white'}`}
                                            placeholder="Confirme a nova senha"
                                        />
                                        {errors.confirmarSenha && <span className="block text-red-500 text-sm mt-1.5">{errors.confirmarSenha}</span>}
                                    </div>

                                    <div className="flex gap-4 justify-end mt-2">
                                        <button
                                            type="button"
                                            disabled={saving}
                                            onClick={() => {
                                                setShowPasswordForm(false);
                                                setSenhaData({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
                                                setErrors({});
                                            }}
                                            className="px-5 py-2.5 border-2 border-gray-200 text-gray-600 rounded-lg hover:border-gray-400 transition-colors font-medium disabled:opacity-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex items-center gap-2 bg-[#B30000] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#990000] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                                                    Salvando...
                                                </>
                                            ) : (
                                                <>
                                                    Alterar Senha
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ModalConfirmacao
                isOpen={modalPerfil}
                onClose={() => setModalPerfil(false)}
                onConfirm={handleSubmitConfirmed}
                titulo="Salvar alteracoes"
                mensagem="Deseja salvar as alteracoes feitas no seu perfil?"
                textoBotaoConfirmar="Salvar"
                tipo="default"
                loading={saving}
            />

            <ModalConfirmacao
                isOpen={modalSenha}
                onClose={() => setModalSenha(false)}
                onConfirm={handlePasswordChangeConfirmed}
                titulo="Alterar senha"
                mensagem="Deseja alterar sua senha?"
                textoBotaoConfirmar="Alterar Senha"
                tipo="warning"
                loading={saving}
            />
        </>
    );
}