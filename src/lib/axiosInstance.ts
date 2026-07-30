import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from '@/src/shared/constans/api-endpoints';

// ─── Axios instance ──────────────────────────────────────────────────────────

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  withCredentials: true, // send HttpOnly cookies on every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Refresh-token state ─────────────────────────────────────────────────────

/** Prevents multiple simultaneous refresh calls when several requests 401 at once */
let isRefreshing = false;

/** Queue of resolvers waiting on the in-flight refresh */
let refreshQueue: Array<(ok: boolean) => void> = [];

function notifyQueue(ok: boolean) {
  refreshQueue.forEach((cb) => cb(ok));
  refreshQueue = [];
}

// ─── Response interceptor ────────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    const status = error.response?.status;

    // ── Non-401 or already-retried → pass through ──────────────────────────
    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // ── Skip refresh loop for the refresh endpoint itself ──────────────────
    const isRefreshEndpoint = originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH);
    const isLogoutEndpoint = originalRequest.url?.includes(API_ENDPOINTS.AUTH.LOGOUT);
    const isLoginEndpoint = originalRequest.url?.includes(API_ENDPOINTS.AUTH.LOGIN);

    if (isRefreshEndpoint || isLogoutEndpoint || isLoginEndpoint) {
      redirectToLogin();
      return Promise.reject(error);
    }

    // ── If a refresh is already in flight, queue this request ──────────────
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push((ok) => {
          if (ok) {
            originalRequest._retry = true;
            resolve(axiosInstance(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    // ── Attempt refresh ────────────────────────────────────────────────────
    isRefreshing = true;
    originalRequest._retry = true;

    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH);
      notifyQueue(true);
      return axiosInstance(originalRequest);
    } catch {
      notifyQueue(false);
      redirectToLogin();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function redirectToLogin() {
  if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
    const locale = window.location.pathname.split('/')[1] || 'ar';
    window.location.href = `/${locale}/login`;
  }
}

export default axiosInstance;
