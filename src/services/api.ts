import axios from 'axios';

// Using the Vercel backend directly as requested.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
console.log("API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
