import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/Routes";
import { LoadingState } from "../components/loading-state/LoadingState";
import { PrivateRoute, GerenteRoute } from "./PrivateRoute";
import { useAuth } from "../context/AuthContext";

// Code splitting por rota — cada página só é carregada quando acessada
const Home             = lazy(() => import("../pages/home/Home").then(m => ({ default: m.Home })));
const Veiculos         = lazy(() => import("../pages/veiculos/Veiculos").then(m => ({ default: m.Veiculos })));
const Login            = lazy(() => import("../pages/login/Login").then(m => ({ default: m.Login })));
const Cadastrar        = lazy(() => import("../pages/cadastrar/Cadastrar").then(m => ({ default: m.Cadastrar })));
const EsqueciSenha     = lazy(() => import("../pages/esqueci-senha/EsqueciSenha").then(m => ({ default: m.EsqueciSenha })));
const RedefinirSenha   = lazy(() => import("../pages/redefinir-senha/RedefinirSenha").then(m => ({ default: m.RedefinirSenha })));
const Busca            = lazy(() => import("../pages/busca/Busca").then(m => ({ default: m.Busca })));
const Servico          = lazy(() => import("../pages/servico/Servico").then(m => ({ default: m.Servico })));
const Carrinho         = lazy(() => import("../pages/carrinho/Carrinho").then(m => ({ default: m.Carrinho })));
const Agendamento      = lazy(() => import("../pages/agendamento/Agendamento").then(m => ({ default: m.Agendamento })));
const Perfil           = lazy(() => import("../pages/perfil/Perfil").then(m => ({ default: m.Perfil })));
const Historico        = lazy(() => import("../pages/historico/Historico").then(m => ({ default: m.Historico })));
const MenuGerente      = lazy(() => import("../pages/gerente/MenuGerente").then(m => ({ default: m.MenuGerente })));
const HomeGerente      = lazy(() => import("../pages/gerente/home/HomeGerente").then(m => ({ default: m.HomeGerente })));
const AgendamentoGerente = lazy(() => import("../pages/gerente/agendamento/AgendamentoGerente").then(m => ({ default: m.AgendamentoGerente })));
const Dashboard        = lazy(() => import("../pages/gerente/dashboard/Dashboard").then(m => ({ default: m.Dashboard })));
const OrdensServico    = lazy(() => import("../pages/gerente/ordens-servico/OrdensServico").then(m => ({ default: m.OrdensServico })));
const ServicosGerente  = lazy(() => import("../pages/gerente/servicos/Servicos").then(m => ({ default: m.Servicos })));
const CategoriasGerente = lazy(() => import("../pages/gerente/categorias/Categorias").then(m => ({ default: m.Categorias })));
const PerfilGerente    = lazy(() => import("../pages/gerente/perfil/PerfilGerente").then(m => ({ default: m.PerfilGerente })));

export default function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isGerente = user?.roles?.includes('ROLE_GERENTE');
  const isGerentePath = location.pathname === ROUTES.GERENTE.HOME || location.pathname.startsWith(`${ROUTES.GERENTE.HOME}/`);

  if (!loading && isGerente && !isGerentePath) {
    return <Navigate to={ROUTES.GERENTE.HOME} replace />;
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        {/* Rotas públicas */}
        <Route path={ROUTES.HOME}           element={<Home />} />
        <Route path={ROUTES.LOGIN}          element={<Login />} />
        <Route path={ROUTES.CADASTRAR}      element={<Cadastrar />} />
        <Route path={ROUTES.ESQUECI_SENHA}  element={<EsqueciSenha />} />
        <Route path={ROUTES.REDEFINIR_SENHA} element={<RedefinirSenha />} />
        <Route path={ROUTES.BUSCA}          element={<Busca />} />
        <Route path={ROUTES.SERVICO}        element={<Servico />} />

        {/* Rotas protegidas — exigem autenticação */}
        <Route path={ROUTES.VEICULOS}    element={<PrivateRoute><Veiculos /></PrivateRoute>} />
        <Route path={ROUTES.CARRINHO}    element={<PrivateRoute><Carrinho /></PrivateRoute>} />
        <Route path={ROUTES.AGENDAMENTO} element={<PrivateRoute><Agendamento /></PrivateRoute>} />
        <Route path={ROUTES.PERFIL}      element={<PrivateRoute><Perfil /></PrivateRoute>} />
        <Route path={ROUTES.HISTORICO}   element={<PrivateRoute><Historico /></PrivateRoute>} />

        {/* Rotas do gerente — exigem autenticação de gerente */}
        <Route path={ROUTES.GERENTE.HOME} element={<GerenteRoute><MenuGerente /></GerenteRoute>}>
          <Route index                               element={<HomeGerente />} />
          <Route path={ROUTES.GERENTE.AGENDAMENTO}   element={<AgendamentoGerente />} />
          <Route path={ROUTES.GERENTE.DASHBOARD}     element={<Dashboard />} />
          <Route path={ROUTES.GERENTE.ORDENS_SERVICO} element={<OrdensServico />} />
          <Route path={ROUTES.GERENTE.SERVICOS}      element={<ServicosGerente />} />
          <Route path={ROUTES.GERENTE.CATEGORIAS}    element={<CategoriasGerente />} />
          <Route path={ROUTES.GERENTE.PERFIL}        element={<PerfilGerente />} />
        </Route>
      </Routes>
    </Suspense>
  );
}