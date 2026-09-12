import axios from 'axios';

const baseURL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: inject JWT Bearer token if available
api.interceptors.request.use(
  (config) => {
    try {
      const sessionRaw = localStorage.getItem('fairfuture_session');
      let token = localStorage.getItem('token') || localStorage.getItem('fairfuture_token');
      if (!token && sessionRaw) {
        const session = JSON.parse(sessionRaw);
        token = session.token;
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore token read errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: graceful error logging for offline/unreachable backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ERR_CONNECTION_REFUSED' ||
      error.code === 'ECONNABORTED' ||
      error.message?.includes('Network Error');

    if (isNetworkError) {
      console.warn(
        `[API] Backend service at ${baseURL} is unreachable or timed out. Activating resilient fallback fixtures.`
      );
    }
    return Promise.reject(error);
  }
);

export default api;
