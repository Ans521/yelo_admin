import axios from 'axios';

const API_BASE_URL = 'http://localhost:3050/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export { API_BASE_URL };
