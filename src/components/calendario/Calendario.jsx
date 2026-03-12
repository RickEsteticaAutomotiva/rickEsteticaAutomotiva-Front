import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { TiposToast } from '../../utils/enum/TiposToast';

export function Calendario({ 
  onDateSelect, 
  onTimeSelect, 
  selectedDate, 
  selectedTime,
  disabled = false 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const { mostrarToast } = useToast();

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableTimes = async (date) => {
    setLoadingTimes(true);

    try {
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock de horários disponíveis
      const times = [
        '08:00', '09:00', '10:00', '11:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
      ];

      const occupiedTimes = [];
      const freeTimes = times.filter(t => !occupiedTimes.includes(t));

      setAvailableTimes(freeTimes);
    } catch (error) {
      mostrarToast({
        tipo: TiposToast.ERRO,
        titulo: 'Erro ao carregar horários',
        mensagem: 'Não foi possível buscar os horários disponíveis. Tente novamente.',
        duracao: 4000
      });
      setAvailableTimes([]);
    } finally {
      setLoadingTimes(false);
    }
  };

  const isTimePassed = (time, date) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDateOnly = new Date(date);
    selectedDateOnly.setHours(0, 0, 0, 0);
    
    if (selectedDateOnly.getTime() !== today.getTime()) {
      return false;
    }
    
    const [hours, minutes] = time.split(':').map(Number);
    const timeDate = new Date();
    timeDate.setHours(hours, minutes, 0, 0);
    
    const currentTimeWithMargin = new Date(now.getTime() + (60 * 60 * 1000));
    
    return timeDate <= currentTimeWithMargin;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayWeek = firstDay.getDay();
    
    const days = [];
    
    // Dias do mês anterior
    for (let i = firstDayWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, otherMonth: true });
    }
    
    // Dias do mês atual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({ date, otherMonth: false });
    }
    
    // Completar a grade (42 dias)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, otherMonth: true });
    }
    
    return days;
  };

  const isDateAvailable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    
    // Não permitir datas passadas
    if (d < today) return false;
    
    // Não permitir domingos (dia 0)
    if (d.getDay() === 0) return false;
    
    return true;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const selectDate = (date) => {
    if (!isDateAvailable(date) || disabled) return;
    onDateSelect(date);
  };

  const selectTime = (time) => {
    if (disabled || isTimePassed(time, selectedDate)) return;
    onTimeSelect(time);
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const today = new Date();
  const daysInMonth = getDaysInMonth(currentDate);

  return (
    <div className="w-full">
      {/* Grade do calendário */}
      <div className="bg-white rounded-t-lg p-4 sm:p-6">
        {/* Navegação */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <button
            className="w-8 h-8 bg-white border-2 border-red-600 text-red-600 rounded-md flex items-center justify-center cursor-pointer transition-all hover:bg-red-600 hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white"
            aria-label="Mês anterior"
            onClick={() => navigateMonth(-1)}
            disabled={
              disabled ||
              (currentDate.getMonth() === today.getMonth() &&
               currentDate.getFullYear() === today.getFullYear())
            }
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          <h2 className="text-lg font-semibold text-gray-800">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            className="w-8 h-8 bg-white border-2 border-red-600 text-red-600 rounded-md flex items-center justify-center cursor-pointer transition-all hover:bg-red-600 hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-white"
            aria-label="Próximo mês"
            onClick={() => navigateMonth(1)}
            disabled={disabled}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        {/* Grade dos dias */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-md overflow-hidden">
          {weekDays.map(day => (
            <div key={day} className="bg-gray-50 py-3 text-center font-semibold text-xs text-gray-500">
              {day}
            </div>
          ))}

          {daysInMonth.map((item, index) => {
            const { date, otherMonth } = item;
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isAvailable = isDateAvailable(date);
            const unavailable = !isAvailable || otherMonth || disabled;

            return (
              <div
                key={index}
                className={`bg-white py-3 text-center transition-all relative min-h-11 flex items-center justify-center text-sm
                  ${ unavailable
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'cursor-pointer hover:bg-red-50 hover:text-red-600'
                  }
                  ${ isToday && !isSelected ? 'font-bold bg-amber-100' : '' }
                  ${ isSelected ? '!bg-red-600 !text-white font-bold' : '' }
                `}
                onClick={() => !otherMonth && selectDate(date)}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Horários */}
      {selectedDate && (
        <div className="horarios-container bg-white rounded-lg p-4 sm:p-6 mt-1 animate-[fade-in-up_0.3s_ease-out]">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Horários disponíveis para {formatDate(selectedDate)}
          </h3>

          {loadingTimes ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <div className="w-8 h-8 border-4 border-gray-100 border-t-red-600 rounded-full animate-spin mb-4" />
              <p>Carregando horários...</p>
            </div>
          ) : availableTimes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 sm:gap-4">
              {availableTimes.map(time => {
                const timePassed = isTimePassed(time, selectedDate);
                const isSelected = selectedTime === time;

                return (
                  <button
                    key={time}
                    className={`py-3 px-4 border-2 rounded-lg cursor-pointer transition-all font-medium text-center
                      ${ isSelected
                          ? 'border-red-600 bg-red-600 text-white'
                          : timePassed
                          ? 'bg-gray-50 text-gray-300 cursor-not-allowed border-gray-100'
                          : 'border-gray-200 bg-white hover:border-red-600 hover:bg-red-50 hover:text-red-600'
                      }
                      disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed disabled:border-gray-100
                    `}
                    onClick={() => selectTime(time)}
                    disabled={disabled || timePassed}
                    title={timePassed ? 'Horário já passou' : ''}
                  >
                    {time}
                    {timePassed && (
                      <i className="bi bi-clock-history ml-1 text-xs"></i>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-500">
              <i className="bi bi-clock text-4xl text-gray-300 mb-2 block"></i>
              <p>Nenhum horário disponível para esta data</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}