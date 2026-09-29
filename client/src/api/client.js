import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach JWT from localStorage as Bearer as well (belt + suspenders w/ cookie)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jewelify_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      // Let callers decide; just pass through
    }
    return Promise.reject(err);
  }
);

export const apiError = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.errors?.[0]?.msg ||
  err?.message ||
  'Something went wrong';
