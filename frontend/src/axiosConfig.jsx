import axios from 'axios';

// Use the API URL directly from environment variables, with a fallback for local development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const envName = process.env.REACT_APP_ENV_NAME || 'development';
console.log('Current environment:', envName);
console.log('Using API endpoint:', API_URL);
const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5001', // local
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
