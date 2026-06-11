import { Button } from "../../../button/Button";

const resolverLinkWhatsApp = (telefone) => {
    if (!telefone) return null;

    const apenasDigitos = String(telefone).replace(/\D/g, '');

    if (!apenasDigitos) return null;

    const telefoneComPais = apenasDigitos.startsWith('55') ? apenasDigitos : `55${apenasDigitos}`;

    return `https://wa.me/${telefoneComPais}`;
};

export function CardAgendamento({ agendamento, imagem, onDetalhesClick }) {
    const linkWhatsApp = resolverLinkWhatsApp(agendamento?.telefone);

    return (
        <div className="bg-gray-50 rounded-lg p-4 flex flex-1 flex-col items-center justify-between gap-4 text-center">
            <h3 className="font-semibold text-lg">{agendamento.servicos[0]?.nome}</h3>
            <div className="flex flex-col items-center gap-2 mt-auto">
                <div className="flex justify-center gap-2">
                    {imagem}
                    <span className="text-gray-600">{agendamento.horario}</span>
                </div>
                <div className="flex justify-center gap-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-500">Placa:</span>
                    <span>{agendamento.placaVeiculo || agendamento.veiculoDetalhado?.placa || agendamento.veiculoDetalhado?.modelo || '-'}</span>
                </div>
            </div>

            {linkWhatsApp && (
                <a
                    href={linkWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-36 items-center justify-center gap-2 rounded-lg bg-green-600 px-8 py-1 font-semibold text-white transition-colors duration-200 hover:bg-green-500"
                    aria-label="Abrir conversa no WhatsApp"
                >
                    <i className="bi bi-whatsapp text-base" aria-hidden="true"></i>
                    WhatsApp
                </a>
            )}

            <Button 
                texto="Detalhes"     
                className="w-36 flex items-center justify-center"
                onClick={() => onDetalhesClick && onDetalhesClick(agendamento)}
            />
        </div>
    );
}