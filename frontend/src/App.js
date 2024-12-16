import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './AuthPage'; // Компонент для регистрации и входа

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} /> {/* Главная страница - форма входа/регистрации */}
        <Route path="/login" element={<AuthPage />} /> {/* Страница для входа */}
        <Route path="/register" element={<AuthPage />} /> {/* Страница для регистрации */}
      </Routes>
    </Router>
  );
};

export default App;
