import { obterChecklistSenha } from "../../utils/validacao/senhaValidacao";

export function PasswordChecklist({ senha = "", className = "" }) {
  const checklist = obterChecklistSenha(senha);

  return (
    <div className={`mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
        Requisitos da senha
      </p>
      <ul className="space-y-1">
        {checklist.map((item) => (
          <li key={item.id} className="flex items-start gap-2 text-sm">
            <i
              className={`bi ${item.isValid ? "bi-check-circle-fill text-green-600" : "bi-circle text-gray-400"}`}
              aria-hidden="true"
            ></i>
            <span className={item.isValid ? "text-green-700" : "text-gray-600"}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
