import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Paginacao } from '../../../components/paginacao/Paginacao';
import { useToast as useToastContext } from '../../../context/ToastContext';
import { categoriaService } from '../../../services/CategoriaService';
import ModalCategoria from './modal-categoria/ModalCategoria';
import { ModalConfirmacao } from '../../../components/modal-confirmacao/ModalConfirmacao';
import CardCategoria from './card-categoria/CardCategoria';

const ITENS_POR_PAGINA = 9;

export const Categorias = () => {
    const { mostrarToast } = useToastContext();

    const mostrarNotificacao = (tipo, mensagem) => {
        try {
            mostrarToast?.({ tipo, mensagem });
        } catch (e) {
            console.error('Erro ao mostrar notificação:', e);
        }
    };

    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalItens, setTotalItens] = useState(0);
    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [modoModal, setModoModal] = useState('criar');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
    const [categoriaParaExcluir, setCategoriaParaExcluir] = useState(null);
    const [excluindo, setExcluindo] = useState(false);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        carregarCategorias();
    }, [paginaAtual, busca]);

    const carregarCategorias = async () => {
        try {
            setCarregando(true);
            setErro(null);

            let resposta;

            if (busca && busca.trim()) {
                resposta = await categoriaService.buscarTodas();
                const filtradas = Array.isArray(resposta)
                    ? resposta.filter((cat) =>
                        cat.nome?.toLowerCase().includes(busca.toLowerCase()) ||
                        cat.descricao?.toLowerCase().includes(busca.toLowerCase())
                    )
                    : [];

                const inicio = paginaAtual * ITENS_POR_PAGINA;
                const fim = inicio + ITENS_POR_PAGINA;
                const categoriasPage = filtradas.slice(inicio, fim);

                setCategorias(categoriasPage);
                setTotalItens(filtradas.length);
            } else {
                resposta = await categoriaService.buscarTodas();
                const categoriasData = Array.isArray(resposta) ? resposta : [];

                const inicio = paginaAtual * ITENS_POR_PAGINA;
                const fim = inicio + ITENS_POR_PAGINA;
                const categoriasPage = categoriasData.slice(inicio, fim);

                setCategorias(categoriasPage);
                setTotalItens(categoriasData.length);
            }
        } catch (erro) {
            const mensagem = erro?.message || 'Erro ao carregar categorias';
            setErro(mensagem);
            setCategorias([]);
            setTotalItens(0);
            mostrarNotificacao('ERRO', mensagem);
        } finally {
            setCarregando(false);
        }
    };

    const handleAbrirModal = () => {
        setModoModal('criar');
        setCategoriaSelecionada(null);
        setModalAberto(true);
    };

    const handleEditarCategoria = (categoria) => {
        setModoModal('editar');
        setCategoriaSelecionada(categoria);
        setModalAberto(true);
    };

    const handleExcluirCategoria = (categoria) => {
        setCategoriaParaExcluir(categoria);
        setModalConfirmacaoAberto(true);
    };

    const handleConfirmarExclusao = async () => {
        if (!categoriaParaExcluir) return;

        try {
            setExcluindo(true);
            await categoriaService.deletarCategoria(categoriaParaExcluir.id);

            mostrarNotificacao('SUCESSO', 'Categoria excluída com sucesso');

            setCategoriaParaExcluir(null);
            setModalConfirmacaoAberto(false);
            carregarCategorias();
        } catch (erro) {
            const mensagem = erro?.message || 'Erro ao excluir categoria';
            mostrarNotificacao('ERRO', mensagem);
        } finally {
            setExcluindo(false);
        }
    };

    const handleSalvarCategoria = async (dados) => {
        try {
            setSalvando(true);

            if (modoModal === 'criar') {
                await categoriaService.criarCategoria(dados);
                mostrarNotificacao('SUCESSO', 'Categoria criada com sucesso');
            } else {
                await categoriaService.atualizarCategoria(dados.id, dados);
                mostrarNotificacao('SUCESSO', 'Categoria atualizada com sucesso');
            }

            setModalAberto(false);
            setCategoriaSelecionada(null);
            setPaginaAtual(0);
            carregarCategorias();
        } catch (erro) {
            const mensagem = erro?.message || 'Erro ao salvar categoria';
            mostrarNotificacao('ERRO', mensagem);
        } finally {
            setSalvando(false);
        }
    };

    const handlePesquisar = (valor) => {
        setBusca(valor);
        setPaginaAtual(0);
    };

    const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Gerenciar Categorias
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {totalItens} categoria{totalItens !== 1 ? 's' : ''} no total
                        </p>
                    </div>

                    <button
                        onClick={handleAbrirModal}
                        className="flex items-center justify-center gap-2 bg-[#B30000] hover:bg-[#8B0000] text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full md:w-auto cursor-pointer"
                    >
                        <Plus size={20} />
                        <span>Nova Categoria</span>
                    </button>
                </div>
            </div>

            {/* Barra de Busca */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#B30000] focus-within:border-transparent transition-all">
                    <Search size={20} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou descrição..."
                        value={busca}
                        onChange={(e) => handlePesquisar(e.target.value)}
                        className="flex-1 outline-none bg-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>
            </div>

            {/* Erro */}
            {erro && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">{erro}</p>
                </div>
            )}

            {/* Carregando */}
            {carregando && (
                <div className="flex justify-center items-center py-12">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#B30000] rounded-full animate-spin" />
                        <p className="text-gray-600">Carregando categorias...</p>
                    </div>
                </div>
            )}

            {/* Grid de Categorias */}
            {!carregando && categorias.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categorias.map((categoria) => (
                        <CardCategoria
                            key={categoria.id}
                            categoria={categoria}
                            onEditar={handleEditarCategoria}
                            onExcluir={handleExcluirCategoria}
                        />
                    ))}
                </div>
            )}

            {/* Sem dados */}
            {!carregando && categorias.length === 0 && !erro && (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-semibold text-gray-600">
                            {busca ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria registrada'}
                        </h3>
                        <p className="text-gray-500 mt-2">
                            {busca
                                ? 'Tente ajustar os termos de busca'
                                : 'Clique em "Nova Categoria" para começar'}
                        </p>
                    </div>
                </div>
            )}

            {/* Paginação */}
            {!carregando && categorias.length > 0 && totalPaginas > 1 && (
                <Paginacao
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    onMudarPagina={setPaginaAtual}
                />
            )}

            {/* Modal de Categoria */}
            <ModalCategoria
                aberto={modalAberto}
                onFechar={() => {
                    setModalAberto(false);
                    setCategoriaSelecionada(null);
                }}
                onSalvar={handleSalvarCategoria}
                categoriaParaEditar={categoriaSelecionada}
                carregando={salvando}
                modo={modoModal}
            />

            {/* Modal de Confirmação de Exclusão */}
            <ModalConfirmacao
                aberto={modalConfirmacaoAberto}
                titulo="Excluir Categoria"
                mensagem={`Tem certeza que deseja excluir a categoria "${categoriaParaExcluir?.nome}"? Esta ação não pode ser desfeita.`}
                textoBotaoPrimario="Excluir"
                textoBotaoSecundario="Cancelar"
                onConfirmar={handleConfirmarExclusao}
                onCancelar={() => {
                    setModalConfirmacaoAberto(false);
                    setCategoriaParaExcluir(null);
                }}
                carregando={excluindo}
            />
        </div>
    );
};

export default Categorias;