import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb";
import { ModalVeiculo } from "../../components/modal-veiculo/ModalVeiculo";
import { ModalConfirmacao } from "../../components/modal-confirmacao/ModalConfirmacao";
import { UseAuth } from "../../hooks/UseAuth";
import { ROUTES } from "../../constants/Routes";
import "./Veiculos.css";
import { VeiculoService } from '../../services/VeiculoService';

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

  // Estados para o modal de confirmação
  const [showModalConfirmacao, setShowModalConfirmacao] = useState(false);
  const [veiculoParaExcluir, setVeiculoParaExcluir] = useState(null);
  const [loadingExclusao, setLoadingExclusao] = useState(false);

  const veiculoService = new VeiculoService();
  const navigate = useNavigate();
  const { isAuthenticated, user } = UseAuth();

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

    sessionStorage.setItem('veiculoSelecionado', JSON.stringify(veiculo));

    navigate('/agendamento');
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

      <div className="veiculos-container">
        <div className="veiculos-card">
          <div className="veiculos-header">
            {!fromHeader && (
              <>
                <h1 className="veiculos-title">Escolha um veículo que irá receber o serviço</h1>
                <p className="veiculos-subtitle">Selecione o veículo e clique em avançar para continuar</p>
              </>
            )}

            {fromHeader && (
              <>
                <h1 className="veiculos-title">Meus Veículos Cadastrados</h1>
                <p className="veiculos-subtitle">Visualize e cadastre seus veículos</p>
              </>
            )}
          </div>

          {error && (
            <div className="error-message">
              <i className="bi bi-exclamation-triangle mr-2"></i>
              {error}
            </div>
          )}

          {veiculos.length === 0 && !loading ? (
            <div className="empty-state">
              <i className="bi bi-car-front text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum veículo cadastrado</h3>
              {!fromHeader && (
                <p className="text-gray-500 mb-4">Você precisa cadastrar um veículo para continuar</p>
              )}
              <button
                onClick={handleAdicionarVeiculo}
                className="btn-primary"
              >
                <i className="bi bi-plus-circle mr-2"></i>
                Cadastrar Primeiro Veículo
              </button>
            </div>
          ) : (
            <>
              <div className="veiculos-list">
                {veiculos.map((veiculo) => (
                  <div
                    key={veiculo.id}
                    className={`veiculo-item ${fromHeader ? '' : veiculoSelecionado === veiculo.id ? 'selected' : ''}`}
                    onClick={() => handleVeiculoSelect(veiculo.id)}
                  >
                    {!fromHeader && (
                      <div className="veiculo-radio">
                        <input
                          type="radio"
                          id={`veiculo-${veiculo.id}`}
                          name="veiculo"
                          value={veiculo.id}
                          checked={veiculoSelecionado === veiculo.id}
                          onChange={() => handleVeiculoSelect(veiculo.id)}
                          className="radio-input"
                        />
                        <label htmlFor={`veiculo-${veiculo.id}`} className="radio-label"></label>
                      </div>
                    )}

                    <div className="veiculo-icon">
                      <i className="bi bi-car-front text-3xl text-gray-400"></i>
                    </div>

                    <div className="veiculo-info">
                      <h3 className="veiculo-nome">
                        {veiculo.marca} {veiculo.modelo}
                      </h3>
                      <div className="veiculo-detalhes">
                        <span className="detalhe-item">
                          <i className="bi bi-calendar3 mr-1"></i>
                          {veiculo.ano}
                        </span>
                        <span className="detalhe-item">
                          <i className="bi bi-palette mr-1"></i>
                          {veiculo.cor}
                        </span>
                        <span className="detalhe-item">
                          <i className="bi bi-credit-card mr-1"></i>
                          {veiculo.placa}
                        </span>
                        <span className="detalhe-item">
                          <i className="bi bi-car-front-fill mr-1"></i>
                          {veiculo.porte}
                        </span>
                      </div>
                    </div>

                    <div className="veiculo-actions">
                      <button
                        className="btn-icon"
                        title="Editar veículo"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditarVeiculo(veiculo);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn-icon btn-danger"
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

              <div className="veiculos-footer">
                <button
                  onClick={handleAdicionarVeiculo}
                  className="btn-secondary"
                >
                  <i className="bi bi-plus-circle mr-2"></i>
                  Adicionar Novo Veículo
                </button>

                {!fromHeader && (
                  <button
                    onClick={handleAvancar}
                    disabled={!veiculoSelecionado}
                    className="btn-primary"
                  >
                    Avançar
                    <i className="bi bi-arrow-right ml-2"></i>
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
            <p className="modal-confirmacao-mensagem">
              Tem certeza que deseja excluir o veículo <strong>{veiculoParaExcluir.marca} {veiculoParaExcluir.modelo}</strong>?
            </p>
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              borderRadius: '8px',
              border: '1px solid #fecaca'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#dc2626',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
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