import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Paginacao } from '../../../components/paginacao/Paginacao';
import { useToast as useToastContext } from '../../../context/ToastContext';
import { servicosService } from '../../../services/ServicosService';
import { categoriaService } from '../../../services/CategoriaService';
import ModalServico from './modal-servico/ModalServico';
import { ModalConfirmacao } from '../../../components/modal-confirmacao/ModalConfirmacao';
import CardServico from './card-servico/CardServico';

const ITENS_POR_PAGINA = 5;

export const Servicos = () => {
  const { mostrarToast } = useToastContext();
  
  const mostrarNotificacao = (tipo, mensagem) => {
    try {
      mostrarToast?.({ tipo, mensagem });
    } catch (e) {
      console.error('Erro ao mostrar notificação:', e);
    }
  };
  
  const [servicos, setServicos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalItens, setTotalItens] = useState(0);
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [categorias, setCategorias] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modoModal, setModoModal] = useState('criar');
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
  const [servicoParaExcluir, setServicoParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    carregarCategorias();
    carregarServicos();
  }, []);

  useEffect(() => {
    carregarServicos();
  }, [paginaAtual, busca, filtroCategoria]);

  const carregarServicos = async () => {
    try {
      setCarregando(true);
      setErro(null);

      let resposta;
      if (busca && busca.trim()) {
        resposta = await servicosService.pesquisar(busca.trim(), {
          pagina: paginaAtual,
          tamanho: ITENS_POR_PAGINA,
          ordenarPor: 'nome'
        });
      } else if (filtroCategoria && filtroCategoria !== 'todos') {
        resposta = await servicosService.buscarPorCategoria(filtroCategoria, {
          pagina: paginaAtual,
          tamanho: ITENS_POR_PAGINA,
          ordenarPor: 'nome'
        });
      } else {
        resposta = await servicosService.buscarTodos({
          pagina: paginaAtual,
          tamanho: ITENS_POR_PAGINA,
          ordenarPor: 'nome'
        });
      }

      const servicosData = Array.isArray(resposta?.content) ? resposta.content : [];
      const total = Number.isInteger(resposta?.totalElements) ? resposta.totalElements : 0;

      setServicos(servicosData);
      setTotalItens(total);
    } catch (erro) {
      const mensagem = erro?.message || 'Erro ao carregar serviços';
      setErro(mensagem);
      setServicos([]);
      setTotalItens(0);
      mostrarNotificacao('ERRO', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const carregarCategorias = async () => {
    try {
      const resposta = await categoriaService.buscarTodas();

      if (Array.isArray(resposta)) {
        setCategorias(resposta);
      } else if (Array.isArray(resposta?.data)) {
        setCategorias(resposta.data);
      } else if (Array.isArray(resposta?.content)) {
        setCategorias(resposta.content);
      } else {
        setCategorias([]);
      }
    } catch (erro) {
      setCategorias([]);
      mostrarNotificacao('AVISO', 'Erro ao carregar categorias');
    }
  };

  const abrirModalCriar = () => {
    setModoModal('criar');
    setServicoSelecionado(null);
    setModalAberto(true);
  };

  const abrirModalEditar = (servico) => {
    setModoModal('editar');
    setServicoSelecionado(servico);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setServicoSelecionado(null);
  };

  const handleSalvarServico = async () => {
    await carregarServicos();
    fecharModal();
  };

  const abrirConfirmacaoExclusao = (servico) => {
    setServicoParaExcluir(servico);
    setModalConfirmacaoAberto(true);
  };

  const confirmarExclusao = async () => {
    if (!servicoParaExcluir) return;

    try {
      setExcluindo(true);
      await servicosService.excluirServico(servicoParaExcluir.id);
      mostrarNotificacao('SUCESSO', 'Serviço excluído com sucesso');
      setModalConfirmacaoAberto(false);
      setServicoParaExcluir(null);
      carregarServicos();
    } catch (erro) {
      mostrarNotificacao('ERRO', 'Erro ao excluir serviço');
    } finally {
      setExcluindo(false);
    }
  };

  const handleMudancaPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  const handleBusca = (valor) => {
    setBusca(valor);
    setPaginaAtual(0);
  };

  const handleFiltroCategoria = (categoria) => {
    setFiltroCategoria(categoria);
    setPaginaAtual(0);
  };

  const totalPaginas = Math.ceil(totalItens / ITENS_POR_PAGINA);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar serviços por nome..."
                value={busca}
                onChange={(e) => handleBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={filtroCategoria}
            onChange={(e) => handleFiltroCategoria(e.target.value)}
            className="px-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="todos">Todas as categorias</option>
            {categorias && categorias.length > 0 && categorias.map(categoria => (
              <option 
                key={categoria?.id || categoria?.nome || categoria} 
                value={categoria?.nome || categoria}
              >
                {categoria?.nome || categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de serviços */}
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
          <p className="text-red-700 font-semibold mb-3">❌ {erro}</p>
          <button
            onClick={() => {
              setErro(null);
              carregarServicos();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {carregando ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B30000]"></div>
        </div>
      ) : servicos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <p className="text-gray-500 text-lg">Nenhum serviço encontrado</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {servicos.map(servico => (
              servico?.id && (
                <CardServico
                  key={servico.id}
                  servico={servico}
                  onEditar={() => abrirModalEditar(servico)}
                  onExcluir={() => abrirConfirmacaoExclusao(servico)}
                />
              )
            ))}
          </div>

          {totalPaginas > 1 && (
            <Paginacao
              paginaAtual={paginaAtual}
              totalPaginas={totalPaginas}
              onMudarPagina={handleMudancaPagina}
            />
          )}
        </>
      )}

      <div className="sticky bottom-4 mt-8 left-6 right-6 z-10">
        <button
          onClick={abrirModalCriar}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold shadow-lg cursor-pointer"
        >
          Novo Serviço
        </button>
      </div>

      {modalAberto && (
        <ModalServico
          isOpen={modalAberto}
          onClose={fecharModal}
          modo={modoModal}
          servico={servicoSelecionado}
          onSuccess={handleSalvarServico}
          categorias={categorias}
        />
      )}

      {modalConfirmacaoAberto && (
        <ModalConfirmacao
          isOpen={modalConfirmacaoAberto}
          onClose={() => setModalConfirmacaoAberto(false)}
          onConfirm={confirmarExclusao}
          titulo="Excluir Serviço"
          mensagem={`Tem certeza que deseja excluir o serviço "${servicoParaExcluir?.nome}"? Esta ação não pode ser desfeita.`}
          textoBotaoConfirmar="Excluir"
          textoBotaoCancelar="Cancelar"
          tipo="danger"
          loading={excluindo}
        />
      )}
    </div>
  );
};

export default Servicos;