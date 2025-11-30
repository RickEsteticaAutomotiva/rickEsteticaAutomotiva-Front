import { Calendar, BanknoteArrowUp, ChartNoAxesColumnIncreasing , Star, Clock } from "lucide-react";
import { CardLargo } from "../../../components/gerente/card/card-largo/CardLargo";
import { CardMedio } from "../../../components/gerente/card/card-medio/CardMedio";

export function HomeGerente(){
    return(
        <>
            <CardLargo text="5 Agendamentos" icon={Calendar} />

            <div className="flex-1 gap-4 mb-6">
                <CardMedio valor="R$ 480" label="Faturamento Estimado" icon={BanknoteArrowUp} />
                <CardMedio valor="R$ 120" label="Ticket Médio" icon={ChartNoAxesColumnIncreasing} />
            </div>

            <CardLargo text="Higienização Interna" icon={Star} />

            <div className="flex-1 gap-4 mb-6">
                <CardMedio valor="14h30" label="Próximo Cliente" icon={Clock} />
                <CardMedio valor="VW Golf" label="Guilherme Serafim" />
            </div>
        </>
    )
}