import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/Routes";
import { Home } from "../pages/home/Home";
import { Veiculos } from "../pages/veiculos/Veiculos";
import { Login } from "../pages/login/Login";
import { Cadastrar } from "../pages/cadastrar/Cadastrar";
import { Busca } from "../pages/busca/Busca";
import { Servico } from "../pages/servico/Servico";
import { Carrinho } from "../pages/carrinho/Carrinho";
import { Agendamento } from "../pages/agendamento/Agendamento";
import { Perfil } from "../pages/perfil/Perfil";
import { Historico } from "../pages/historico/Historico";
import { HomeGerente } from "../pages/gerente/home/HomeGerente";
import { MenuGerente } from "../pages/gerente/MenuGerente";
import { AgendamentoGerente } from "../pages/gerente/agendamento/AgendamentoGerente";
import { Dashboard } from "../pages/gerente/dashboard/Dashboard";
import { OrdensServico } from "../pages/gerente/ordens-servico/OrdensServico";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.VEICULOS} element={<Veiculos />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.CADASTRAR} element={<Cadastrar />} />
        <Route path={ROUTES.BUSCA} element={<Busca />} />
        <Route path={ROUTES.SERVICO} element={<Servico />} />
        <Route path={ROUTES.CARRINHO} element={<Carrinho />} />
        <Route path={ROUTES.AGENDAMENTO} element={<Agendamento />} />
        <Route path={ROUTES.PERFIL} element={<Perfil />} />
        <Route path={ROUTES.HISTORICO} element={<Historico />} />
        <Route path={ROUTES.GERENTE.HOME} element={<MenuGerente />}>
          <Route index element={<HomeGerente />} />
          <Route path={ROUTES.GERENTE.AGENDAMENTO} element={<AgendamentoGerente />} />
          <Route path={ROUTES.GERENTE.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.GERENTE.ORDENS_SERVICO} element={<OrdensServico />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}