import { Button } from "../../../components/Button/Button";
import { CardAgendamento } from "../../../components/gerente/card/card-agendamento/CardAgendamento";
import { CardPequeno } from "../../../components/gerente/card/card-pequeno/CardPequeno";

export function AgendamentoGerente() {

        const handleDetalhesClick = (agendamento) => {
        console.log("Detalhes do agendamento:", agendamento);
        // Aqui você pode implementar a lógica para mostrar detalhes
    };

    const todosAgendamentos = [
        {
            id: 1,
            servico: "Lavagem",
            horario: "9h00"
        },
        {
            id: 2,
            servico: "Limpeza de interior",
            horario: "12h00"
        },
        {
            id: 3,
            servico: "Lavagem",
            horario: "17h00"
        },
        {
            id: 4,
            servico: "Limpeza de interior",
            horario: "18h00"
        }
    ];

    return (
        <div className="mt-4">
            <div className="flex justify-center bg-white rounded-2xl p-5 mb-6 shadow-sm">
                <div className="flex flex-col items-center gap-5">
                    <h2 className="text-2xl font-semibold text-center">Próximo agendamento</h2>
                    <div className="flex justify-center items-center gap-10">
                        <div className="flex flex-col gap-7">
                            <CardPequeno texto="Polimento" label="Servico" />
                            <CardPequeno texto="14h30" label="Horário" src="/icon-relogio.svg" alt="Relógio" />
                        </div>
                        <div className="bg-gray-300 w-px h-full"></div>
                        <div className="flex flex-col gap-7">                            
                            <CardPequeno texto="Golf" label="Veículo" />
                            <CardPequeno texto="R$ 200" label="Valor" src="/icon-money.svg" alt="Dinheiro" />
                        </div>
                    </div>
                                    
                    <Button texto="Detalhes" className=""/>                                  
                </div>
            </div>
                <h2 className="text-2xl font-semibold text-center mb-6">Todos</h2>

            <div>                
                <div className="grid grid-cols-2 gap-4">
                    {todosAgendamentos.map((agendamento) => (
                        <CardAgendamento
                            key={agendamento.id}
                            agendamento={agendamento}
                            onDetalhesClick={handleDetalhesClick}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}