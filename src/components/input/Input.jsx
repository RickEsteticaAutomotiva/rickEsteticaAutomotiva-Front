import { useState } from 'react';

export function Input(props) {
    const [temErro, setTemErro] = useState(false);

    const validarInput = (e) => {
        if (props.obrigatorio && e.target.value === '') {
            setTemErro(true);
        } else {
            setTemErro(false);
        }
    };

    return (
        <div className="flex flex-col w-64 p-4">
            {props.label && (
                <label className="flex justify-between items-center mb-4 text-sm font-medium text-gray-700">
                    {props.label}
                </label>
            )}
            <input
                type={props.tipo || 'text'}
                className={`p-2.5 border rounded w-full focus:outline-none focus:ring-2 focus:ring-brand/30 transition-shadow ${
                    temErro
                        ? 'border-red-500 shadow-[0_0_5px_rgba(255,0,0,0.3)]'
                        : 'border-gray-300'
                }`}
                onBlur={validarInput}
            />
        </div>
    );
}