import axios from 'axios';

const ip = process.env.ENV_NAME === 'production' ? 'http://54.66.213.198:5001': 'http://localhost:5001';
const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5001', // local
  baseURL: ip,
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
