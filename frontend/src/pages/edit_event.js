import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EventManagementPage = () => {
  const { calendarId } = useParams();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    // Загружаем события для выбранного календаря
    axios
      .get(`http://localhost:3001/api/calendars/${calendarId}/events`)
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching events', error);
      });
  }, [calendarId]);

  const handleEventSubmit = () => {
    // Отправляем данные нового события на сервер
    axios
      .post(`http://localhost:3001/api/calendars/${calendarId}/events`, newEvent)
      .then((response) => {
        setEvents([...events, response.data]);
        setNewEvent({ title: '', startDate: '', endDate: '' });
      })
      .catch((error) => {
        console.error('Error creating event', error);
      });
  };

  return (
    <div>
      <h1>Manage Events for Calendar {calendarId}</h1>

      <div>
        <h2>Create Event</h2>
        <form onSubmit={handleEventSubmit}>
          <label>
            Title:
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
          </label>
          <label>
            Start Date:
            <input
              type="datetime-local"
              value={newEvent.startDate}
              onChange={(e) =>
                setNewEvent({ ...newEvent, startDate: e.target.value })
              }
            />
          </label>
          <label>
            End Date:
            <input
              type="datetime-local"
              value={newEvent.endDate}
              onChange={(e) =>
                setNewEvent({ ...newEvent, endDate: e.target.value })
              }
            />
          </label>
          <button type="submit">Create Event</button>
        </form>
      </div>

      <h2>Existing Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.title} - {new Date(event.startDate).toLocaleString()} to {new Date(event.endDate).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventManagementPage;