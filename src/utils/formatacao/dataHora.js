/**
 * Formata uma data para o formato brasileiro completo
 * @param {string|Date} dataString - Data a ser formatada
 * @returns {string} Data formatada (ex: "segunda-feira, 12 de novembro de 2025")
 */
export const formatarDataCompleta = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Formata uma data para o formato brasileiro simples
 * @param {string|Date} dataString - Data a ser formatada
 * @returns {string} Data formatada (ex: "12/11/2025")
 */
export const formatarDataSimples = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
};

/**
 * Formata o horário no formato brasileiro
 * @param {string|Date} dataString - Data/hora a ser formatada
 * @returns {string} Horário formatado (ex: "14:30")
 */
export const formatarHorario = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Formata data e horário juntos
 * @param {string|Date} dataString - Data/hora a ser formatada
 * @returns {string} Data e horário formatados (ex: "12/11/2025 às 14:30")
 */
export const formatarDataHorario = (dataString) => {
    return `${formatarDataSimples(dataString)} às ${formatarHorario(dataString)}`;
};

/**
 * Formata data e horário completos
 * @param {string|Date} dataString - Data/hora a ser formatada
 * @returns {string} Data e horário formatados (ex: "segunda-feira, 12 de novembro de 2025 às 14:30")
 */
export const formatarDataHorarioCompleto = (dataString) => {
    return `${formatarDataCompleta(dataString)} às ${formatarHorario(dataString)}`;
};