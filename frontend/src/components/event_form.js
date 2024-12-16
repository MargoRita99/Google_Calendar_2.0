import React, { useState } from 'react';

const EventForm = ({ event, onSave }) => {
  const [eventDetails, setEventDetails] = useState(event);

  const handleSave = () => {
    onSave(eventDetails);
  };

  return (
    <form>
      <input
        type="text"
        value={eventDetails.name}
        onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })}
      />
      <button type="button" onClick={handleSave}>Save</button>
    </form>
  );
};

export default EventForm;