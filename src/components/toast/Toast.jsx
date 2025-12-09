import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { TiposToast } from '../../utils/enum/TiposToast';

export function Toast({ 
    tipo = TiposToast.INFO,
    titulo,
    subtitulo,
    mensagem,
    duracao = 3000,
    aoFechar
}) {
    const [estaVisivel, setEstaVisivel] = useState(true);
    const [estaPausado, setEstaPausado] = useState(false);
    const timerRef = useRef(null);
    const tempoInicioRef = useRef(Date.now());
    const tempoRestanteRef = useRef(duracao);

    const tiposConfig = {
        sucesso: {
            Icone: CheckCircle,
            classes: 'bg-green-50 border-green-200 text-green-800',
            iconeBg: 'bg-green-500'
        },
        erro: {
            Icone: AlertCircle,
            classes: 'bg-red-50 border-red-200 text-red-800',
            iconeBg: 'bg-red-500'
        },
        alerta: {
            Icone: AlertTriangle,
            classes: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            iconeBg: 'bg-yellow-500'
        },
        info: {
            Icone: Info,
            classes: 'bg-blue-50 border-blue-200 text-blue-800',
            iconeBg: 'bg-blue-500'
        }
    };

    const config = tiposConfig[tipo] || tiposConfig.info;
    const { Icone, classes, iconeBg } = config;

    useEffect(() => {
        if (!estaPausado && duracao > 0) {
            tempoInicioRef.current = Date.now();
            timerRef.current = setTimeout(() => {
                fecharToast();
            }, tempoRestanteRef.current);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [estaPausado, duracao]);

    const aoEntrarMouse = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            const tempoDecorrido = Date.now() - tempoInicioRef.current;
            tempoRestanteRef.current -= tempoDecorrido;
            setEstaPausado(true);
        }
    };

    const aoSairMouse = () => {
        setEstaPausado(false);
    };

    const fecharToast = () => {
        setEstaVisivel(false);
        setTimeout(() => {
            if (aoFechar) aoFechar();
        }, 300);
    };

    return (
        <div 
            className={`w-[90%] max-w-md mx-auto transition-all duration-300 ${
                estaVisivel ? 'animate-slide-down opacity-100' : 'opacity-0'
            }`}
            onMouseEnter={aoEntrarMouse}
            onMouseLeave={aoSairMouse}
        >
            <div className={`${classes} border rounded-lg shadow-lg p-4 flex items-start gap-3`}>
                <div className={`${iconeBg} rounded-full p-1 flex-shrink-0`}>
                    <Icone size={20} className="text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-0.5">
                        {titulo}
                    </h3>
                    
                    {subtitulo && (
                        <p className="text-xs opacity-80 mb-1">
                            {subtitulo}
                        </p>
                    )}
                    
                    <p className="text-sm opacity-90">
                        {mensagem}
                    </p>
                </div>

                <button
                    onClick={fecharToast}
                    className="hover:opacity-70 transition-opacity flex-shrink-0"
                    aria-label="Fechar notificação"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    );
}