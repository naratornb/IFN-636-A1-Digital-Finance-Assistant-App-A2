import axios from 'axios';

// Use the API URL directly from environment variables, with a fallback for local development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const envName = process.env.REACT_APP_ENV_NAME || 'development';
console.log('Current environment:', envName);
console.log('Using API endpoint:', API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - please check if the backend server is running at:', API_URL);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
