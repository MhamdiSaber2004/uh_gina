import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://uh-gina-backend.onrender.com', // change to your backend URL
});

// Automatically attach token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
