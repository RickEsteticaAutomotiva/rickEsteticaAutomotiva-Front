import { Button } from "../../../button/Button";

export function CardAgendamento({ agendamento, imagem, onDetalhesClick }) {
    return (
        <div className="bg-gray-50 rounded-lg p-4 flex flex-1 flex-col items-center justify-between gap-4 text-center">
            <h3 className="font-semibold text-lg">{agendamento.servicos[0]?.nome}</h3>
            <div className="flex  justify-center  gap-2 mt-auto">
                {imagem}
                <span className="text-gray-600">{agendamento.horario}</span>
            </div>

            <Button 
                texto="Detalhes"     
                onClick={() => onDetalhesClick && onDetalhesClick(agendamento)}
            />
        </div>
    );
}