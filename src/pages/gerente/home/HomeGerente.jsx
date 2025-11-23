import { CardLargo } from "../../../components/gerente/card/card-largo/CardLargo";
import { CardMedio } from "../../../components/gerente/card/card-medio/CardMedio";

export function HomeGerente(){
    return(
        <>
            <CardLargo text="5 Agendamentos" src="/icon-agendar.svg" alt="Agendar"  />

            <div className="flex gap-4 mb-6">
                <CardMedio valor="R$ 480" label="Faturamento Estimado" src="/icon-money.svg" alt="Dinheiro"/>
                <CardMedio valor="R$ 120" label="Ticket Médio" src="/icon-grafico.svg" alt="Grafico" />
            </div>

            <CardLargo text="Higienização Interna" src="/icon-estela.svg" alt="Higienização" />

            <div className="flex gap-4 mb-6">
                <CardMedio valor="14h30" label="Próximo Cliente" src="/icon-relogio.svg" alt="Relógio" />
                <CardMedio valor="VW Golf" label="Guilherme Serafim" />
            </div>
        </>
    )
}