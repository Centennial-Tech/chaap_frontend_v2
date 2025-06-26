import axios from "axios";
import { refreshToken } from "./helpers/refreshToken";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // change if needed
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Prevent infinite refresh loop
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        const success = await refreshToken();

        isRefreshing = false;

        if (success) {
          return api(originalRequest); // Retry original request
        }
      }

      return Promise.reject(err);
    }

    return Promise.reject(err);
  }
);

export default api;
