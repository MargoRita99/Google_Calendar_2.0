import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/main_auth'; 
import CalendarSelectionPage from './pages/CalendarSelectionPage';
import EventManagementPage from './pages/EventManagementPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} /> 
        <Route path="/register" element={<AuthPage />} /> 
        <Route path="/" element={<CalendarSelectionPage />} />
        <Route path="/events/:calendarId" element={<EventManagementPage />} />
      </Routes>
    </Router>
  );
};

export default App;
