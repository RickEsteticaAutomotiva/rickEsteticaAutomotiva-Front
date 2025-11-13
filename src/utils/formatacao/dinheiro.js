/**
 * Formata um valor numérico para o formato de moeda brasileira
 * @param {number|string} valor - Valor a ser formatado
 * @param {boolean} incluirSimbolo - Se deve incluir o símbolo R$ (padrão: true)
 * @returns {string} Valor formatado (ex: "R$ 123,45" ou "123,45")
 */
export const formatarPreco = (valor, incluirSimbolo = true) => {
    if (valor === null || valor === undefined || isNaN(valor)) {
        return incluirSimbolo ? 'R$ 0,00' : '0,00';
    }

    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    const valorFormatado = numero.toFixed(2).replace('.', ',');
    
    return incluirSimbolo ? `R$ ${valorFormatado}` : valorFormatado;
};