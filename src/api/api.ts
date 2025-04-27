import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux/store";
import { login } from "../redux/authSlice";
const PORT = 8080; // Replace with your actual port number

const api = axios.create({
  baseURL: `http://localhost:${PORT}/api`,
  withCredentials: true,
});

export const auth = axios.create({
  baseURL: `http://localhost:${PORT}/auth`,
  withCredentials: true,
});

export const useAPI = () => {
  const { token } = useSelector((state) => (state as any).auth);
  const dispatch = useDispatch<AppDispatch>();

  api.interceptors.request.use(
    (config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const resultAction = await dispatch(login({ email: "", password: "" })); // Replace with actual credentials);

          if (login.fulfilled.match(resultAction)) {
            const newToken = resultAction.payload.accessToken;

            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

            return api(originalRequest);
          } else {
            console.error("Token refresh failed");
            return Promise.reject(error);
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};