export const StatusAgendamento = {
  0: { label: 'ANÁLISE', classe: 'status-analise', icon: 'bi bi-hourglass-split' },
  1: { label: 'AGENDA CONFIRMADA', classe: 'status-confirmado', icon: 'bi bi-check-circle' },
  2: { label: 'EM EXECUÇÃO', classe: 'status-execucao', icon: 'bi bi-gear' },
  3: { label: 'CANCELADO', classe: 'status-cancelado', icon: 'bi bi-x-circle' },
  4: { label: 'CONCLUÍDO', classe: 'status-concluido', icon: 'bi bi-check-circle' }
};

export const tradutorStatus = (status) => {
  return StatusAgendamento[status] || { 
    label: 'Status Desconhecido', 
    classe: 'status-desconhecido',
    icon: 'bi bi-question-circle'
  };
};