import axios from 'axios';

const API_BASE_URL = 'http://82.180.144.143:3050/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export { API_BASE_URL };
