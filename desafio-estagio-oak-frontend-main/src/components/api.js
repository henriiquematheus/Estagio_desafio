import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // not 'http://localhost:8000/api/products'
  withCredentials: true,
});

export default api;