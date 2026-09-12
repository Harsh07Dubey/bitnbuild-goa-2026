import axios from 'axios';

const DEFAULT_BASE_URL = 'https://fairfuture-backend.onrender.com/api';

const baseURL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  DEFAULT_BASE_URL;

const api = axios.create({
  baseURL,
  timeout: 30000, // 30s timeout to accommodate Render free-tier cold-start latency
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── REQUEST INTERCEPTOR: Inject JWT Bearer Token ──────────────────────────────
api.interceptors.request.use(
  (config) => {
    try {
      // Look for token in standard localStorage key, or session fallback
      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('fairfuture_token') ||
        (() => {
          try {
            const sess = localStorage.getItem('fairfuture_session');
            return sess ? JSON.parse(sess)?.token : null;
          } catch {
            return null;
          }
        })();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('[API Request Interceptor] Failed to read token:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR: Global Error Handling & 401 Redirect ──────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Handle 401 Unauthorized: Expired/Invalid JWT
    if (status === 401) {
      console.warn('[API] 401 Unauthorized received. Clearing session.');
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('fairfuture_token');
        localStorage.removeItem('fairfuture_session');
      } catch (err) {
        console.warn('[API] Failed to clear localStorage on 401:', err);
      }

      // Avoid infinite redirects if already on public/auth routes
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const isAuthPage =
          currentPath === '/login' ||
          currentPath === '/verify-otp' ||
          currentPath === '/';

        if (!isAuthPage) {
          window.location.href = '/login?expired=true';
        }
      }
    }

    // Handle Network Error / Render Free-Tier Spin-down
    const isNetworkError =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.message?.includes('timeout') ||
      error.message?.includes('Network Error');

    if (isNetworkError) {
      console.warn(
        `[API] Render backend (${baseURL}) is currently warming up or unreachable. Code: ${error.code || 'TIMEOUT'}`
      );
    }

    return Promise.reject(error);
  }
);

/**
 * Non-blocking cold-start warmup helper.
 * Free-tier Render instances sleep after 15 mins of inactivity.
 * Triggering a GET /health request on initial load wakes up the backend.
 */
export async function warmupBackend() {
  try {
    const res = await api.get('/health', { timeout: 15000 });
    return res.data;
  } catch (err) {
    // Silent catch — warmup is best-effort
    console.info('[API Warmup] Backend wake-up ping dispatched.');
    return null;
  }
}

export default api;
