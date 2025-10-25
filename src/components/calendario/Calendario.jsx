import { useState, useEffect } from 'react';
import './Calendario.css';

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
      console.error('Erro ao buscar horários:', error);
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
    date.setHours(0, 0, 0, 0);
    
    // Não permitir datas passadas
    if (date < today) return false;
    
    // Não permitir domingos (dia 0)
    if (date.getDay() === 0) return false;
    
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
    <div className="calendario-wrapper">
      <div className="calendario-container">
        <div className="calendario-navigation">
          <button 
            className="nav-button"
            onClick={() => navigateMonth(-1)}
            disabled={
              disabled || 
              (currentDate.getMonth() === today.getMonth() && 
               currentDate.getFullYear() === today.getFullYear())
            }
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          <h2 className="mes-ano">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button 
            className="nav-button"
            onClick={() => navigateMonth(1)}
            disabled={disabled}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        <div className="calendario-grid">
          {weekDays.map(day => (
            <div key={day} className="dia-semana">{day}</div>
          ))}

          {daysInMonth.map((item, index) => {
            const { date, otherMonth } = item;
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isAvailable = isDateAvailable(date);

            return (
              <div
                key={index}
                className={`dia-calendario ${
                  otherMonth ? 'outro-mes' : ''
                } ${
                  isToday ? 'hoje' : ''
                } ${
                  isSelected ? 'selected' : ''
                } ${
                  !isAvailable || otherMonth || disabled ? 'disabled' : ''
                }`}
                onClick={() => !otherMonth && selectDate(date)}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="horarios-container">
          <h3 className="horarios-title">
            Horários disponíveis para {formatDate(selectedDate)}
          </h3>

          {loadingTimes ? (
            <div className="horarios-loading">
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
              <p>Carregando horários...</p>
            </div>
          ) : availableTimes.length > 0 ? (
            <div className="horarios-grid">
              {availableTimes.map(time => {
                const timePassed = isTimePassed(time, selectedDate);
                
                return (
                  <button
                    key={time}
                    className={`horario-button ${
                      selectedTime === time ? 'selected' : ''
                    } ${
                      timePassed ? 'time-passed' : ''
                    }`}
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
            <div className="sem-horarios">
              <i className="bi bi-clock text-4xl text-gray-300 mb-2 block"></i>
              <p>Nenhum horário disponível para esta data</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}