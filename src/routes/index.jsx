import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Home } from "../pages/home/Home";
import { Veiculos } from "../pages/veiculos/Veiculos";
import { Login } from "../pages/login/Login";
import { Cadastrar } from "../pages/cadastrar/Cadastrar";
import { Busca } from "../pages/busca/Busca";
import { Servico } from "../pages/servico/Servico";
import { Carrinho } from "../pages/carrinho/Carrinho";

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
      </Routes>
    </BrowserRouter>
  );
}