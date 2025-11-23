import { Button } from "../../../Button/Button";

export function CardAgendamento({ agendamento, onDetalhesClick }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center gap-4">
            <div className="text-center">
                <h3 className="font-semibold text-lg">{agendamento.servico}</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600">{agendamento.horario}</span>
                </div>
            </div>
            <Button 
                texto="Detalhes"     
                onClick={() => onDetalhesClick && onDetalhesClick(agendamento)}
            />
        </div>
    );
}