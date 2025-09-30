import axios from 'axios';

// Your backend URL
const BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Add a request interceptor to include the token from localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
