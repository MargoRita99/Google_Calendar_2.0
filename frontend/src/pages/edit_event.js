import React, { useState } from 'react';

const EditEventPage = ({ eventId }) => {
  const [eventDetails, setEventDetails] = useState({});

  const handleSave = () => {
    // Сохранение изменений на сервере
  };

  return (
    <div>
      <h1>Edit Event</h1>
      <form onSubmit={handleSave}>
        <input
          type="text"
          placeholder="Event Name"
          value={eventDetails.name}
          onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })}
        />
        <input
          type="datetime-local"
          value={eventDetails.date}
          onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditEventPage;