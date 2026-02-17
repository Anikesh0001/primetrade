import axios from "axios";
import { tokenStorage } from "./tokenStorage";
import { loadingStore } from "./loadingStore";
import { authEvents } from "./authEvents";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  loadingStore.start();
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const processQueue = (token: string | null) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
};

api.interceptors.response.use(
  (response) => {
    loadingStore.stop();
    return response;
  },
  async (error) => {
    loadingStore.stop();
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clear();
        authEvents.notifyLogout();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await api.post("/auth/refresh", { refreshToken });
        const { accessToken, refreshToken: newRefresh } = response.data.data;
        tokenStorage.setTokens(accessToken, newRefresh);
        processQueue(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        tokenStorage.clear();
        authEvents.notifyLogout();
        processQueue(null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
