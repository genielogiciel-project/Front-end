import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { login, refreshToken } from "@/features/auth/authSlice";
const PORT = 8080; // Replace with your actual port number

const api = axios.create({
  baseURL: `http://localhost:${PORT}/api`,
  withCredentials: true,
});

export const auth = axios.create({
  baseURL: `http://localhost:${PORT}/api/auth`,
  withCredentials: true,
});

export const useAPI = () => {
  const { token, user } = useSelector((state) => (state as RootState).auth);
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
          const resultAction = await dispatch(
            refreshToken({
              userNumber: user?.userNumber as string,
              password: user?.password as string,
            })
          ); // Replace with actual credentials);

          if (refreshToken.fulfilled.match(resultAction)) {
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
