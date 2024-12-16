import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // адрес вашего бэкенда
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const fetchEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};