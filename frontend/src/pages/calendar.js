import React, { useEffect, useState } from 'react';
import { fetchData } from '../services/api';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = BigCalendar.momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      // Получить события с бэкенда или Google Календаря
      const result = await fetchData();
      setEvents(result);
    };
    loadEvents();
  }, []);

  const handleEventClick = (event) => {
    // Открыть модальное окно для редактирования события
  };

  return (
    <div>
      <h1>Calendar</h1>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventClick}
      />
    </div>
  );
};

export default CalendarPage;