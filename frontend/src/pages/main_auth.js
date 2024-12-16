import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // Для Google регистрации
import axios from 'axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Определяет, показываем ли форму для входа или регистрации
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async (response) => {
    const { tokenId } = response;
    try {
      const res = await axios.post('${process.env.REACT_APP_API_URL}/api/google-login', { tokenId });
      const { accessToken } = res.data;
      localStorage.setItem('token', accessToken); // Сохраняем токен для дальнейших запросов
      alert('Успешный вход через Google');
      // Перенаправление на страницу календаря
    } catch (error) {
      console.error('Ошибка при Google входе', error.response?.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Выполнить вход
      const res = await axios.post('${process.env.REACT_APP_API_URL}/api/login', { email, password });
      // Если успешный вход, перенаправить на страницу календаря
    } else {
      try {
        const res = await axios.post('${process.env.REACT_APP_API_URL}/api/register', { email, password });
        alert('Регистрация успешна, войдите в аккаунт.');
        setIsLogin(true);
      } catch (error) {
        console.error('Ошибка при регистрации', error.response?.data);
      }
    }
  };

  return (
    <div>
      <h1>{isLogin ? 'Войти' : 'Зарегистрироваться'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
        />
        <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>

      {isLogin ? (
        <>
          <p>Еще нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
        </>
      ) : (
        <>
          <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
        </>
      )}

      {/* Google Login */}
      <GoogleLogin
        clientId="your-google-client-id"
        buttonText="Зарегистрироваться через Google"
        onSuccess={handleGoogleLogin}
        onFailure={(err) => console.log(err)}
      />
    </div>
  );
};

export default AuthPage;