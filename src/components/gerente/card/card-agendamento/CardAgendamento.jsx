import { Button } from "../../../button/Button";
import { MessageCircle } from 'lucide-react';

export function CardAgendamento({ agendamento, imagem, onDetalhesClick }) {
    const linkWhatsApp = agendamento?.whatsappLink;

    return (
        <div className="bg-gray-50 rounded-lg p-4 flex flex-1 flex-col items-center justify-between gap-4 text-center">
            <h3 className="font-semibold text-lg">{agendamento.servicos[0]?.nome}</h3>
            <p className="text-sm text-gray-600">{agendamento.cliente || '-'}</p>
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

            <div className="flex items-center gap-2 flex-wrap justify-center">
                <Button
                    texto="Detalhes"
                    onClick={() => onDetalhesClick && onDetalhesClick(agendamento)}
                />

                <a
                    href={linkWhatsApp || undefined}
                    target={linkWhatsApp ? "_blank" : undefined}
                    rel={linkWhatsApp ? "noopener noreferrer" : undefined}
                    aria-label="Abrir conversa no WhatsApp"
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-1.5 font-semibold transition-colors duration-200 ${
                        linkWhatsApp
                            ? 'bg-green-600 text-white hover:bg-green-500'
                            : 'bg-gray-200 text-gray-400 pointer-events-none cursor-not-allowed'
                    }`}
                    title={linkWhatsApp ? 'Abrir WhatsApp do cliente' : 'Cliente sem telefone cadastrado'}
                >
                    <MessageCircle size={18} />
                    WhatsApp
                </a>
            </div>
        </div>
    );
}