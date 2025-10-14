import { Link } from "react-router-dom"
import { ROUTES } from "../../constants/routes"

export function Cadastrar() {
  return (
    <div>
      <h1>Cadastrar</h1>
      <p>Página de cadastro</p>
      <Link to={ROUTES.LOGIN}>Login</Link>
    </div>
  );
}