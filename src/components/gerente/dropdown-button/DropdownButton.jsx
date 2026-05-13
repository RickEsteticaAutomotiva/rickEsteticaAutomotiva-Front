import { ChevronDown } from 'lucide-react';
import { useEffect } from 'react';

export function DropdownButton({ 
    valorSelecionado, 
    setValorSelecionado, 
    dropdownAberto, 
    setDropdownAberto, 
    valores, 
    comSelecionar = false 
}) {
    useEffect(() => {
        if (comSelecionar && !valorSelecionado) {
            setValorSelecionado({ id: null, valor: 'Selecionar' });
        }
    }, [comSelecionar]);

    const isObject = valores.length > 0 && typeof valores[0] === 'object';

    return (
        <>
            <button
                onClick={() => setDropdownAberto(!dropdownAberto)}
                className="bg-white text-gray-400 focus:rounded-lg text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 px-3 py-2 min-w-[100px] transition-colors flex items-center justify-between"
            >
                <span>{isObject ? (valorSelecionado?.valor || 'Selecionar') : (valorSelecionado || 'Selecionar')}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${dropdownAberto ? 'rotate-180' : ''}`} />
            </button>

            {dropdownAberto && (
                <>
                    {/* Overlay para fechar dropdown ao clicar fora */}
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setDropdownAberto(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-20">
                        {comSelecionar && (
                            <button
                                onClick={() => {
                                    setValorSelecionado(isObject ? { id: null, valor: 'Selecionar' } : 'Selecionar');
                                    setDropdownAberto(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors rounded-t-lg ${
                                    (isObject ? valorSelecionado?.valor === 'Selecionar' : valorSelecionado === 'Selecionar') 
                                        ? 'bg-red-50 text-red-600' 
                                        : 'text-gray-700'
                                }`}
                            >
                                Selecionar
                            </button>
                        )}
                        {valores.map((valor, index) => {
                            const displayText = isObject ? valor.valor : valor;
                            const isSelected = isObject 
                                ? valorSelecionado?.id === valor.id 
                                : valorSelecionado === valor;

                            return (
                                <button
                                    key={isObject ? valor.id : valor}
                                    onClick={() => {
                                        setValorSelecionado(valor);
                                        setDropdownAberto(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                        isSelected ? 'bg-red-50 text-red-600' : 'text-gray-700'
                                    } ${!comSelecionar && index === 0 ? 'rounded-t-lg' : ''} ${
                                        index === valores.length - 1 ? 'rounded-b-lg' : ''
                                    }`}
                                >
                                    {displayText}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </>
    );
}