import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb";
import { ModalVeiculo } from "../../components/modal-veiculo/ModalVeiculo";
import { ModalConfirmacao } from "../../components/modal-confirmacao/ModalConfirmacao";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/Routes";
import { veiculoService } from '../../services/VeiculoService';

export function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [veiculoParaEditar, setVeiculoParaEditar] = useState(null);
  const [modoModal, setModoModal] = useState('adicionar');
  const location = useLocation();
  const fromHeader = location.state?.fromHeader || false;

  const [showModalConfirmacao, setShowModalConfirmacao] = useState(false);
  const [veiculoParaExcluir, setVeiculoParaExcluir] = useState(null);
  const [loadingExclusao, setLoadingExclusao] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const breadcrumbItems = [
    {
      label: 'Início',
      href: ROUTES.HOME,
      icon: 'bi bi-house'
    },
    {
      label: 'Carrinho',
      href: ROUTES.CARRINHO,
      icon: 'bi bi-cart3'
    },
    {
      label: 'Selecionar Veículo',
      icon: 'bi bi-car-front'
    }
  ];

  const breadcrumbItemsFromHeader = [
    {
      label: 'Início',
      href: ROUTES.HOME,
      icon: 'bi bi-house'
    },
    {
      label: 'Selecionar Veículo',
      icon: 'bi bi-car-front'
    }
  ];

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }

    buscarVeiculos();
  }, [user]);

  const buscarVeiculos = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await veiculoService.buscarVeiculosPorUsuario(user.id);
      setVeiculos(data);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVeiculoSelect = (veiculoId) => {
    setVeiculoSelecionado(veiculoId);
  };

  const handleAvancar = () => {
    if (!veiculoSelecionado) {
      alert('Por favor, selecione um veículo para continuar.');
      return;
    }

    const veiculo = veiculos.find(v => v.id === veiculoSelecionado);
    if (!veiculo) return;

    navigate(ROUTES.AGENDAMENTO, { state: { veiculoSelecionado: veiculo } });
  };

  const handleAdicionarVeiculo = () => {
    setModoModal('adicionar');
    setVeiculoParaEditar(null);
    setShowModal(true);
  };

  const handleEditarVeiculo = (veiculo) => {
    setModoModal('editar');
    setVeiculoParaEditar(veiculo);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    buscarVeiculos();
    setShowModal(false);
    setVeiculoParaEditar(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setVeiculoParaEditar(null);
  };

  const handleDeletarVeiculo = (veiculo) => {
    setVeiculoParaExcluir(veiculo);
    setShowModalConfirmacao(true);
  };

  const confirmarExclusao = async () => {
    if (!veiculoParaExcluir) return;

    setLoadingExclusao(true);

    try {
      await veiculoService.removerVeiculo(veiculoParaExcluir.id);

      if (veiculoSelecionado === veiculoParaExcluir.id) {
        setVeiculoSelecionado(null);
      }

      await buscarVeiculos();
      setShowModalConfirmacao(false);
      setVeiculoParaExcluir(null);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingExclusao(false);
    }
  };

  const cancelarExclusao = () => {
    setShowModalConfirmacao(false);
    setVeiculoParaExcluir(null);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando veículos...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Breadcrumb items={fromHeader ? breadcrumbItemsFromHeader : breadcrumbItems} />

      <div className="flex justify-center p-4 md:p-8 min-h-[calc(100vh-210px)] bg-gray-50">
        <div className="bg-white rounded-xl shadow-md w-full max-w-[800px] h-fit overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-200">
            {!fromHeader && (
              <>
                <h1 className="text-2xl font-bold mb-2">Escolha um veículo que irá receber o serviço</h1>
                <p className="text-gray-500 text-sm">Selecione o veículo e clique em avançar para continuar</p>
              </>
            )}

            {fromHeader && (
              <>
                <h1 className="text-2xl font-bold mb-2">Meus Veículos Cadastrados</h1>
                <p className="text-gray-500 text-sm">Visualize e cadastre seus veículos</p>
              </>
            )}
          </div>

          {error && (
            <div className="mx-6 my-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center gap-2">
              <i className="bi bi-exclamation-triangle"></i>
              {error}
            </div>
          )}

          {veiculos.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <i className="bi bi-car-front text-6xl text-gray-300 mb-4 block"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum veículo cadastrado</h3>
              {!fromHeader && (
                <p className="text-gray-500 mb-4">Você precisa cadastrar um veículo para continuar</p>
              )}
              <button
                onClick={handleAdicionarVeiculo}
                className="flex items-center gap-2 bg-[#B30000] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#990000] transition-colors"
              >
                <i className="bi bi-plus-circle"></i>
                Cadastrar Primeiro Veículo
              </button>
            </div>
          ) : (
            <>
              <div className="p-6">
                {veiculos.map((veiculo) => (
                  <div
                    key={veiculo.id}
                    className={`flex items-center p-4 md:p-6 border-2 rounded-xl mb-4 cursor-pointer transition-all hover:border-red-500 hover:shadow-md${!fromHeader && veiculoSelecionado === veiculo.id ? ' border-red-500 bg-red-50 shadow-md' : ' border-gray-200 bg-white'}`}
                    onClick={() => handleVeiculoSelect(veiculo.id)}
                  >
                    {!fromHeader && (
                      <div className="relative mr-4">
                        <input
                          type="radio"
                          id={`veiculo-${veiculo.id}`}
                          name="veiculo"
                          value={veiculo.id}
                          checked={veiculoSelecionado === veiculo.id}
                          onChange={() => handleVeiculoSelect(veiculo.id)}
                          className="absolute opacity-0 cursor-pointer w-0 h-0"
                        />
                        <label htmlFor={`veiculo-${veiculo.id}`}
                          className={`block w-5 h-5 border-2 rounded-full cursor-pointer transition-all${veiculoSelecionado === veiculo.id ? ' border-red-600 bg-red-600' : ' border-gray-300 bg-white'}`}>
                        </label>
                      </div>
                    )}

                    <div className={`flex items-center justify-center w-14 h-14 rounded-xl mr-6 flex-shrink-0${!fromHeader && veiculoSelecionado === veiculo.id ? ' bg-red-100' : ' bg-gray-100'}`}>
                      <i className={`bi bi-car-front text-2xl${!fromHeader && veiculoSelecionado === veiculo.id ? ' text-red-600' : ' text-gray-400'}`}></i>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {veiculo.marca} {veiculo.modelo}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span>
                          <i className="bi bi-calendar3 mr-1"></i>
                          {veiculo.ano}
                        </span>
                        <span>
                          <i className="bi bi-palette mr-1"></i>
                          {veiculo.cor}
                        </span>
                        <span>
                          <i className="bi bi-credit-card mr-1"></i>
                          {veiculo.placa}
                        </span>
                        <span>
                          <i className="bi bi-car-front-fill mr-1"></i>
                          {veiculo.porte}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#B30000] hover:text-[#B30000] transition-colors"
                        title="Editar veículo"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditarVeiculo(veiculo);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-red-600 hover:bg-red-600 hover:text-white transition-colors"
                        title="Excluir veículo"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletarVeiculo(veiculo);
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 p-6 border-t border-gray-200">
                <button
                  onClick={handleAdicionarVeiculo}
                  className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:border-[#B30000] hover:text-[#B30000] transition-colors"
                >
                  <i className="bi bi-plus-circle"></i>
                  Adicionar Novo Veículo
                </button>

                {!fromHeader && (
                  <button
                    onClick={handleAvancar}
                    disabled={!veiculoSelecionado}
                    className="flex items-center gap-2 bg-[#B30000] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#990000] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Avançar
                    <i className="bi bi-arrow-right"></i>
                  </button>)}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />

      <ModalVeiculo
        isOpen={showModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        veiculo={veiculoParaEditar}
        modo={modoModal}
      />

      <ModalConfirmacao
        isOpen={showModalConfirmacao}
        onClose={cancelarExclusao}
        onConfirm={confirmarExclusao}
        titulo="Excluir Veículo"
        tipo="danger"
        textoBotaoConfirmar="Excluir"
        textoBotaoCancelar="Cancelar"
        loading={loadingExclusao}
      >
        {veiculoParaExcluir && (
          <div>
            <p className="text-gray-700 mb-4">
              Tem certeza que deseja excluir o veículo <strong>{veiculoParaExcluir.marca} {veiculoParaExcluir.modelo}</strong>?
            </p>
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <i className="bi bi-exclamation-triangle"></i>
                Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>
        )}
      </ModalConfirmacao>
    </>
  );
}