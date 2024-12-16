import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GoogleCalendarIntegrationPage = () => {
  const [connected, setConnected] = useState(false);
  const [calendars, setCalendars] = useState([]);

  const handleConnectClick = async () => {
    // Логика для подключения к Google API через OAuth2
    setConnected(true);
    // Получить календари после подключения
  };

  return (
    <div>
      <h1>Google Calendar Integration</h1>
      {!connected ? (
        <button onClick={handleConnectClick}>Подключиться</button>
      ) : (
        <div>
          <h2>Выберите календари для синхронизации</h2>
          <ul>
            {calendars.map((calendar) => (
              <li key={calendar.id}>
                <input type="checkbox" id={calendar.id} />
                <label htmlFor={calendar.id}>{calendar.summary}</label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarIntegrationPage;