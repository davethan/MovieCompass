import axios from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export default request;
