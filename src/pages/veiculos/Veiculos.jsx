import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "../../components/header/Header";
import { Breadcrumb } from "../../components/breadcrumb/Breadcrumb";
import { UseAuth } from "../../hooks/UseAuth";
// import { usuariosService } from "../../services/UsuarioService";
import { ROUTES } from "../../constants/routes";
import "./Veiculos.css";

export function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
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

  const veiculosMock = [
    {
      id: 1,
      marca: "Toyota",
      modelo: "Corolla",
      ano: 2020,
      cor: "Branco",
      placa: "ABC-1234",
      tipo: "Sedã"
    },
    {
      id: 2,
      marca: "Honda",
      modelo: "Civic",
      ano: 2019,
      cor: "Preto",
      placa: "XYZ-5678",
      tipo: "Sedã"
    },
    {
      id: 3,
      marca: "Volkswagen",
      modelo: "Golf",
      ano: 2021,
      cor: "Azul",
      placa: "DEF-9012",
      tipo: "Hatchback"
    }
  ];

  useEffect(() => {
    // if (!isAuthenticated()) {
    //   navigate(ROUTES.LOGIN);
    //   return;
    // }
    buscarVeiculos();
  }, []);

  const buscarVeiculos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Substitua por sua chamada da API
      
      // Simulação com mock
      setTimeout(() => {
        setVeiculos(veiculosMock);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      setError(error.message);
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
    setShowModal(true);
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
      <Breadcrumb items={breadcrumbItems} />

      <div className="veiculos-container">
        <div className="veiculos-card">
          <div className="veiculos-header">
            <h1 className="veiculos-title">Escolha um veículo que irá receber o serviço</h1>
            <p className="veiculos-subtitle">Selecione o veículo e clique em avançar para continuar</p>
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
              <p className="text-gray-500 mb-4">Você precisa cadastrar um veículo para continuar</p>
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
                    className={`veiculo-item ${veiculoSelecionado === veiculo.id ? 'selected' : ''}`}
                    onClick={() => handleVeiculoSelect(veiculo.id)}
                  >
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
                          {veiculo.tipo}
                        </span>
                      </div>
                    </div>

                    <div className="veiculo-actions">
                      <button 
                        className="btn-icon"
                        title="Editar veículo"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Implementar edição
                        }}
                      >
                        <i className="bi bi-pencil"></i>
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

                <button 
                  onClick={handleAvancar}
                  disabled={!veiculoSelecionado}
                  className="btn-primary"
                >
                  Avançar
                  <i className="bi bi-arrow-right ml-2"></i>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal para adicionar veículo (implementar depois) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Adicionar Novo Veículo</h2>
            <p>Modal para cadastro de veículo (implementar formulário)</p>
            <button onClick={() => setShowModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
}