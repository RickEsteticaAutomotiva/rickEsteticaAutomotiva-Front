import { formatarDataHorario } from "../../../../utils";
import { Button } from "../../../button/Button";

export function CardAgendamento({ agendamento, imagem, onDetalhesClick }) {
    const dataExibicao = agendamento.dataAgendamento 
        ? formatarDataHorario(agendamento.dataAgendamento)
        : agendamento.horario;

    return (
        <div className="rounded-lg p-4 flex flex-1 flex-col items-center justify-between gap-4 text-center shadow" style={{ backgroundColor: "#FFFFFF" }}>
            <h3 className="font-semibold text-lg">{agendamento.servicos[0]?.nome}</h3>
            <div className="flex  justify-center  gap-2 mt-auto">
                {imagem}
                <span className="text-gray-600">{dataExibicao}</span>
            </div>

            <Button 
                texto="Detalhes"     
                onClick={() => onDetalhesClick && onDetalhesClick(agendamento)}
            />
        </div>
    );
}