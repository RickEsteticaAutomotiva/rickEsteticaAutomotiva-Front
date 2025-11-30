import { Button } from "../../../components/button/Button";
import { CardAgendamento } from "../../../components/gerente/card/card-agendamento/CardAgendamento";
import { CardPequeno } from "../../../components/gerente/card/card-pequeno/CardPequeno";
import { Clock, X, BanknoteArrowUp, Car } from 'lucide-react';
import { useState } from 'react';
import { ModalOrdemServico } from "./modal-ordem-servico/ModalOrdemServico";

export function AgendamentoGerente() {
    const [modalAberto, setModalAberto] = useState(false);
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

    const abrirModal = (agendamento) => {
        setAgendamentoSelecionado(agendamento);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setAgendamentoSelecionado(null);
    };

const todosAgendamentos = [
    {
        id: 1,
        horario: "9h00",
        cliente: "João Silva",
        veiculo: "Honda Civic",
        valor: "R$ 80,00",
        status: "Pendente",
        dataAgendamento: "17/11/2025 - 9:00:00",
        dataConclusao: "--/--/---- - --:--",
        observacoes: "Cliente solicitou lavagem completa com cera. Veículo apresenta sujeira acumulada.",
        servicos: [
            { id: 1, nome: "Lavagem Externa", valor: "R$ 30,00" },
            { id: 2, nome: "Enceramento", valor: "R$ 50,00" }
        ]
    },
    {
        id: 2,
        horario: "12h00",
        cliente: "Maria Santos",
        veiculo: "Toyota Corolla",
        valor: "R$ 120,00",
        status: "Pendente",
        dataAgendamento: "17/11/2025 - 12:00:00",
        dataConclusao: "--/--/---- - --:--",
        observacoes: "Limpeza completa do interior com aspiração e produtos específicos para couro.",
        servicos: [
            { id: 3, nome: "Limpeza de Interior", valor: "R$ 80,00" },
            { id: 4, nome: "Higienização de Bancos", valor: "R$ 40,00" }
        ]
    },
    {
        id: 3,
        horario: "17h00",
        cliente: "Pedro Costa",
        veiculo: "Volkswagen Golf",
        valor: "R$ 200,00",
        status: "Pendente",
        dataAgendamento: "17/11/2025 - 17:00:00",
        dataConclusao: "--/--/---- - --:--",
        observacoes: "Serviço completo de polimento e lavagem externa.",
        servicos: [
            { id: 5, nome: "Polimento", valor: "R$ 150,00" },
            { id: 6, nome: "Lavagem Externa", valor: "R$ 30,00" },
            { id: 7, nome: "Proteção Cera", valor: "R$ 20,00" }
        ]
    },
    {
        id: 4,
        horario: "18h00",
        cliente: "Ana Oliveira",
        veiculo: "Chevrolet Onix",
        valor: "R$ 100,00",
        status: "Pendente",
        dataAgendamento: "17/11/2025 - 18:00:00",
        dataConclusao: "--/--/---- - --:--",
        observacoes: "Cliente possui animais de estimação, necessário aspiração detalhada.",
        servicos: [
            { id: 8, nome: "Limpeza de Interior", valor: "R$ 70,00" },
            { id: 9, nome: "Aspiração Detalhada", valor: "R$ 30,00" }
        ]
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
                            <CardPequeno texto="14h30" label="Horário" icon={Clock} />
                        </div>
                        <div className="bg-gray-300 w-px h-full"></div>
                        <div className="flex flex-col gap-7">                            
                            <CardPequeno texto="Golf" label="Veículo" />
                            <CardPequeno texto="R$ 200" label="Valor" icon={BanknoteArrowUp} />
                        </div>
                    </div>
                                    
                    <Button texto="Detalhes"
                        onClick={() => abrirModal && abrirModal(todosAgendamentos[2])}
                    />                                  
                </div>
            </div>
            <h2 className="text-2xl font-semibold text-center mb-6">Todos</h2>

            <div>                
                <div className="grid grid-cols-2 gap-4 py-4">
                    {todosAgendamentos.map((agendamento) => (
                        <CardAgendamento
                            key={agendamento.id}
                            agendamento={agendamento}
                            imagem={<Clock />}
                            onDetalhesClick={abrirModal}
                        />
                    ))}
                </div>
            </div>

            <ModalOrdemServico
                isOpen={modalAberto}
                agendamento={agendamentoSelecionado}
                onClose={fecharModal}
            />

        </div>
    );
}