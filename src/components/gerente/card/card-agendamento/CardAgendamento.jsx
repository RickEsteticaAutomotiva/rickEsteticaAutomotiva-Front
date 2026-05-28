import { Button } from "../../../button/Button";

export function CardAgendamento({ agendamento, imagem, onDetalhesClick }) {
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

            <Button 
                texto="Detalhes"     
                onClick={() => onDetalhesClick && onDetalhesClick(agendamento)}
            />
        </div>
    );
}