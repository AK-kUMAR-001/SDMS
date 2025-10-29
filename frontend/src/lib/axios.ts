import axios from 'axios';

console.log('Axios baseURL:', import.meta.env.VITE_API_URL);

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`
});

instance.interceptors.request.use(config => {
  const t = localStorage.getItem('token');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default instance;