import { useState } from 'react';
import './Input.css';

export function Input(props) {
    const [temErro, setTemErro] = useState(false);

    const validarInput = (e) => {
        if (props.obrigatorio && e.target.value === '') {
            setTemErro(true);
        } else {
            setTemErro(false);
        }
    }

    return (
        <div className='input-container'>
            {props.label && <label className="label-input">{props.label}</label>}
            <input
                type={props.tipo || 'text'}
                className={`input ${temErro ? 'input-erro' : ''}`}
                onBlur={validarInput}
            />
        </div>
    )
}